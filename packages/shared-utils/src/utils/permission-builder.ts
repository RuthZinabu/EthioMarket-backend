import { logger } from "./logger";
import { PermissionAction, PermissionModule } from "@emacare/mongo";
import { RedisClient, RedisValuePairKeys } from "../redis-client";

// ── Types ────────────────────────────────────────────────────────────

export type RequiredPermission =
  | string
  | { name: PermissionModule; action: PermissionAction }
  | "*";

type PermissionMap = Record<string, Set<string>>;

// ── Core Helpers (FAST) ──────────────────────────────────

function addToMap(map: PermissionMap, name: string, actions: string[]) {
  let set = map[name];
  if (!set) {
    set = new Set<string>();
    map[name] = set;
  }

  for (const action of actions) {
    set.add(action);
  }
}

function finalizeMap(map: PermissionMap): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(map)) {
    result[k] = [...v];
  }
  return result;
}

// ── Mongoose-safe extractor  ───────────────────────

function extractPermissionName(permission: unknown): string | undefined {
  if (!permission) return undefined;

  // populated case: { name: string }
  if (typeof permission === "object" && permission !== null && "name" in permission) {
    const name = (permission as { name?: unknown }).name;
    return typeof name === "string" ? name : undefined;
  }

  // not populated (string/ObjectId) → ignore
  return undefined;
}

// ── Build Map from DB ────────────────────────────────────────────────

export function buildMapFromPermissions(
  permissions: { permission?: unknown; actions?: string[] }[],
): Record<string, string[]> {
  const map: PermissionMap = {};

  for (const p of permissions) {
    const name = extractPermissionName(p.permission);
    if (!name) continue;

    addToMap(map, name, p.actions ?? []);
  }

  return finalizeMap(map);
}
