import moment from "moment";
import { RedisClient } from "@emacare/shared-utils";

/**
 * Dual-layer tiered lockout (login + OTP attempts):
 *
 *  CHECK  → Redis only  (O(1), no DB hit — fastest possible rejection)
 *  UPDATE → Redis + MongoDB (Redis enforces, MongoDB persists for durability/audit/recovery)
 *
 *  Tiers:
 *    Attempts 1–2  → no lock, show tries remaining
 *    Attempt  3    → 15-min soft lock
 *    Attempt  4    → 30-min soft lock
 *    Attempt  5+   → permanent lock (enabled=false in DB, permanent key in Redis)
 */

const LOCK_TIERS: { atAttempt: number; minutes: number; ttlSeconds: number }[] = [
  { atAttempt: 3, minutes: 15, ttlSeconds: 15 * 60 },
  { atAttempt: 4, minutes: 30, ttlSeconds: 30 * 60 },
];

export const FIRST_LOCK_AT = LOCK_TIERS[0].atAttempt; // 3 — cooldown kicks in here
export const PERMANENT_LOCK_AT = 5;

/** Redis key builders */
export const LockKeys = {
  loginLock: (entityType: "user" | "agent", id: string) => `lock:login:${entityType}:${id}`,
  otpLock: (entityType: "user" | "agent", id: string) => `lock:otp:${entityType}:${id}`,
  session: (entityType: "user" | "agent", id: string) => `session:${entityType}:${id}`,
};

export interface LockCheckResult {
  isLocked: boolean;
  ttlSeconds?: number;
  isPermanent?: boolean;
}

/**
 * Apply result returned to callers — used to write the same lock state to MongoDB.
 */
export interface ApplyLockResult {
  /** True if account must be permanently disabled in DB */
  shouldPermanentlyDisable: boolean;
  /**
   * The expiry Date to persist as nextLoginAttempt / nextOtpAttempt in MongoDB.
   * Null means no lock was applied (attempt count below first tier).
   */
  nextAttemptAt: Date | null;
}

// ─── CHECK (Redis only) ───────────────────────────────────────────────────────

/**
 * CHECK: Fast Redis-only lock lookup.
 * Call this at the start of every attempt — no DB involved.
 */
export async function checkLock(redisKey: string): Promise<LockCheckResult> {
  const redis = await RedisClient.getClient();
  const value = await redis.get(redisKey);

  if (value === null) return { isLocked: false };
  if (value === "permanent") return { isLocked: true, isPermanent: true };

  const ttl = await redis.ttl(redisKey);
  return { isLocked: true, ttlSeconds: ttl > 0 ? ttl : 0 };
}

// ─── UPDATE (Redis + MongoDB payload) ────────────────────────────────────────

/**
 * UPDATE: Write lock to Redis, return fields to persist to MongoDB.
 * Call this after confirming a failed attempt.
 *
 * @param redisKey  The lock Redis key.
 * @param attempts  New total attempt count (already incremented).
 * @returns         ApplyLockResult — MongoDB fields + permanent disable flag.
 */
export async function applyLock(redisKey: string, attempts: number): Promise<ApplyLockResult> {
  const redis = await RedisClient.getClient();

  // Permanent lock — both Redis (no TTL) and DB disable
  if (attempts >= PERMANENT_LOCK_AT) {
    await redis.set(redisKey, "permanent");
    return { shouldPermanentlyDisable: true, nextAttemptAt: null };
  }

  const tier = LOCK_TIERS.find((t) => attempts === t.atAttempt);
  if (tier) {
    const unlockAt = moment().add(tier.minutes, "minutes").toDate();
    // Write to Redis with TTL (enforcement layer)
    await redis.set(redisKey, unlockAt.toISOString(), "EX", tier.ttlSeconds);
    // Return the expiry Date so the caller can persist it to MongoDB
    return { shouldPermanentlyDisable: false, nextAttemptAt: unlockAt };
  }

  // Below first tier threshold — no lock yet
  return { shouldPermanentlyDisable: false, nextAttemptAt: null };
}

// ─── CLEAR (on success / password reset) ─────────────────────────────────────

/**
 * CLEAR: Remove the Redis lock. Call on successful auth or password change.
 */
export async function clearLock(redisKey: string): Promise<void> {
  const redis = await RedisClient.getClient();
  await redis.del(redisKey);
}

// ─── Session Management ───────────────────────────────────────────────────────

/**
 * Redis-based session management.
 * Tokens are stored under session:<type>:<id> with TTL matching JWT expiry.
 * Replacing the session key logs out any previously active session (single-session model).
 */
export const SessionManager = {
  /** Store a new session token. Overwrites any existing session. */
  async set(
    entityType: "user" | "agent",
    id: string,
    token: string,
    ttlSeconds: number,
  ): Promise<void> {
    const redis = await RedisClient.getClient();
    await redis.set(LockKeys.session(entityType, id), token, "EX", ttlSeconds);
  },

  /** Retrieve the stored session token. Returns null if absent or expired. */
  async get(entityType: "user" | "agent", id: string): Promise<string | null> {
    const redis = await RedisClient.getClient();
    return redis.get(LockKeys.session(entityType, id));
  },

  /** Destroy a session (logout / password change). */
  async destroy(entityType: "user" | "agent", id: string): Promise<void> {
    const redis = await RedisClient.getClient();
    await redis.del(LockKeys.session(entityType, id));
  },

  /**
   * Validate a JWT token matches the stored session.
   * Prevents stale token replay after logout or password change.
   */
  async validate(entityType: "user" | "agent", id: string, token: string): Promise<boolean> {
    const stored = await this.get(entityType, id);
    return stored === token;
  },
};

// ─── Message Helpers ──────────────────────────────────────────────────────────

/** Human-readable lock message for API responses. */
export function lockMessage(result: LockCheckResult): string {
  if (result.isPermanent) {
    return "Your account has been permanently locked due to too many failed attempts. Please contact support.";
  }
  if (result.ttlSeconds !== undefined && result.ttlSeconds > 0) {
    const minutes = Math.ceil(result.ttlSeconds / 60);
    return `Too many failed attempts. Please try again in ${minutes} minute(s).`;
  }
  return "Account temporarily locked. Please try again later.";
}

/** Remaining tries message before first lock tier kicks in. */
export function triesLeftMessage(triesLeft: number): string {
  return `Incorrect password. ${triesLeft} attempt(s) remaining before your account is temporarily locked.`;
}
