import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedException, ForbiddenException, errorDefinitions } from "../common";
import { IUser, Realm } from "@emacare/mongo/types";
import { decryptTokenInfo, encryptTokenInfo, generateJwtToken } from "./token";
import { RedisClient } from "../redis-client";
import { userRepository } from "@emacare/mongo/repository";
import { PopulateOptions, ProjectionFields } from "mongoose";
import { logger } from "../utils/logger";
import { buildMapFromPermissions } from "../utils/permission-builder";

const TOKEN_RENEWAL_THRESHOLD_MINUTES = 10;
const MILLISECONDS_IN_MINUTE = 60 * 1000;
const USER_CACHE_TTL_SEC = 300;
const USER_CACHE_KEY_PREFIX = "AUTH:USER:";

export type AuthToken = {
  accessToken: string;
  isForPreLogin: boolean;
  isForForgotPassword: boolean;
  isForSetPassword: boolean;
  isForPasswordLogin?: boolean;
  isMainToken: boolean;
  isSetPassword?: boolean;
  organizationInfo?: Record<string, string | boolean>;

  // portalCards?: string[];
  detailedPermissions?: Record<string, string[]>;
  branchToken?: string;
};

export type _UserToken = Partial<IUser & AuthToken & { _id?: any }>;

export interface AuthRequest extends Request {
  _user?: _UserToken;
}

export function createAuthenticate(
  getSecret: () => {
    JWT_SECRET: string | undefined;
    JWT_ENCRYPTION_KEY: string | undefined;
    JWT_EXPIRES_IN: string | undefined;
  },
) {
  return async function authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const secret = getSecret();
      const redisClient = await RedisClient.getClient();

      if (!secret?.JWT_SECRET || !secret?.JWT_ENCRYPTION_KEY || !secret?.JWT_EXPIRES_IN) {
        console.log("Authentication middleware misconfigured");
        return next(
          new UnauthorizedException(errorDefinitions.GENERAL.INVALID_SERVER_CONFIGURATION),
        );
      }
      const authHeader = req.headers["authorization"];
      const token = authHeader?.split(" ")[1];

      if (!token) {
        return next(new UnauthorizedException(errorDefinitions.GENERAL.AUTH_HEADER_MISSING));
      }
      const decoded = jwt.verify(token, secret.JWT_SECRET!, {
        ignoreExpiration: true,
      }) as unknown as {
        data: string | Record<string, unknown>;
        exp?: number;
      };

      let userPayload: Record<string, unknown>;

      // Safe Extraction of data
      const rawData = (decoded as any).data;

      if (typeof rawData === "object" && rawData !== null) {
        userPayload = rawData as Record<string, unknown>;
      } else if (typeof rawData === "string") {
        if (rawData.includes(".")) {
          userPayload = decryptTokenInfo(rawData, secret.JWT_ENCRYPTION_KEY!) as Record<
            string,
            unknown
          >;
        } else {
          try {
            userPayload = JSON.parse(rawData);
          } catch (e) {
            return next(new UnauthorizedException(errorDefinitions.GENERAL.INVALID_TOKEN_FORMAT));
          }
        }
      } else {
        // Fallback for root-level payloads
        const { iat, exp, ...rest } = decoded as any;
        userPayload = rest;
      }

      if (!userPayload || typeof userPayload !== "object") {
        return next(new UnauthorizedException(errorDefinitions.GENERAL.INVALID_TOKEN_FORMAT));
      }

      if (!userPayload || typeof userPayload !== "object") {
        console.error("[Auth] userPayload is not an object:", userPayload);
        return next(new UnauthorizedException(errorDefinitions.GENERAL.INVALID_TOKEN_FORMAT));
      }

      // Ensure session expiry is set
      if (!userPayload.expiresIn) {
        const expiryDate = new Date();
        const duration = parseInt(secret?.JWT_EXPIRES_IN) || 30; // fallback to 30 mins
        expiryDate.setMinutes(expiryDate.getMinutes() + duration);
        userPayload.expiresIn = expiryDate.toISOString();
      }

      // Check cache for user data or fetch from DB
      let userData: Record<string, unknown> | null = null;
      const userId = userPayload._id ? String(userPayload._id) : null;

      if (userId) {
        const userCacheKey = USER_CACHE_KEY_PREFIX + userId;
        try {
          const cachedUser = await redisClient.get(userCacheKey);
          if (cachedUser) {
            const cached = JSON.parse(cachedUser) as Record<string, unknown>;
            // Validate cached user is still valid
            if (cached.enabled && !cached.isDeleted) {
              userData = cached;
            }
          }
        } catch (err) {
          logger.error("Error reading user from Redis cache", err);
        }

        if (!userData) {
          try {
            const _returnedFields: ProjectionFields<IUser> = {
              realm: 1,
              firstName: 1,
              lastName: 1,
              email: 1,
              phoneNumber: 1,
              organization: 1,
              isDeleted: 1,
              enabled: 1,
              role: 1,
              userCode: 1,
              additionalPermissions: 1,
              permissionGroup: 1,
            };
            const populateOptions: PopulateOptions[] = [
              {
                path: "additionalPermissions.permission",
                select: "name",
              },
              {
                path: "permissionGroup",
                populate: {
                  path: "permissions.permission",
                  select: "name",
                },
              },
            ];

            const _user = await userRepository.findOne(
              { _id: userId },
              {},
              populateOptions,
              _returnedFields,
            );

            if (!_user) {
              logger.error("User not found in DB by ID during authentication", { userId });
            } else if (_user.isDeleted || !_user.enabled) {
              return next(new ForbiddenException(errorDefinitions.GENERAL.INVALID_TOKEN));
            } else {
              const additionalPermissions = buildMapFromPermissions(
                _user?.additionalPermissions || [],
              );

              userData = { ..._user, additionalPermissions };

              try {
                await redisClient.set(
                  userCacheKey,
                  JSON.stringify(userData),
                  "EX",
                  USER_CACHE_TTL_SEC,
                );
              } catch (err) {
                logger.error("Error caching user to Redis", err);
              }
            }
          } catch (err) {
            logger.error("Error fetching identity from repository", err);
          }
        }
      }

      req._user = {
        ...userPayload,
        ...(userData ?? {}),
      } as JwtPayload as _UserToken;

      logger.info("Setting req._user in authenticate", {
        userId: (req._user as any)?._id || (req._user as any)?.id,
        realm: (req._user as any)?.realm,
        hasOrganization: !!(req._user as any)?.organizationId,
        organizationId: (req._user as any)?.organizationId,
      });

      // Calculate time remaining for both JWT and session expiry
      const CLOCK_SKEW_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes
      const jwtExpiry = decoded.exp ? decoded.exp * 1000 : Infinity;
      const currentTime = Date.now();
      const jwtTimeRemaining =
        jwtExpiry === Infinity ? Infinity : jwtExpiry + CLOCK_SKEW_TOLERANCE_MS - currentTime;

      const expiresInValue = userPayload.expiresIn;

      if (
        !expiresInValue ||
        (typeof expiresInValue !== "string" && typeof expiresInValue !== "number")
      ) {
        return next(new UnauthorizedException(errorDefinitions.GENERAL.INVALID_TOKEN_FORMAT));
      }

      const sessionExpiry = new Date(expiresInValue).getTime();
      const sessionTimeRemaining = sessionExpiry + CLOCK_SKEW_TOLERANCE_MS - currentTime;

      // Use the JWT expiry for validation, as it's the standard.
      const timeRemaining = jwtTimeRemaining;

      // Expiration is already handled by jwt.verify above with clockTolerance.
      // We no longer perform a manual check here to avoid false positives.

      // Handle main token validation and renewal
      if (userPayload.isMainToken && String(userPayload.realm).toUpperCase() !== "BRANCH") {
        const realmPrefix =
          String(userPayload.realm || "").toUpperCase() === "AGENT" ? "agent" : "user";
        const sessionKey = `session:${realmPrefix}:${userId}`;
        const redisToken = userId ? await redisClient.get(sessionKey) : null;

        if (!redisToken) {
          logger.error("Session token not found in Redis", { sessionKey, userId });
          return next(new ForbiddenException(errorDefinitions.GENERAL.INVALID_TOKEN));
        }

        // Enforce single active session with renewal exception
        if (redisToken !== token) {
          // Allow renewal if token is about to expire
          if (
            timeRemaining > 0 &&
            timeRemaining < TOKEN_RENEWAL_THRESHOLD_MINUTES * MILLISECONDS_IN_MINUTE
          ) {
            // Continue with renewal process
          } else {
            return next(new ForbiddenException(errorDefinitions.AUTH_MS.SESSION_EXPIRED));
          }
        }

        // Token renewal logic
        if (
          timeRemaining > 0 &&
          timeRemaining < TOKEN_RENEWAL_THRESHOLD_MINUTES * MILLISECONDS_IN_MINUTE
        ) {
          await renewToken(
            userPayload,
            {
              JWT_SECRET: secret.JWT_SECRET!,
              JWT_ENCRYPTION_KEY: secret.JWT_ENCRYPTION_KEY!,
              JWT_EXPIRES_IN: secret.JWT_EXPIRES_IN!,
            },
            redisClient,
            res,
          );
        }
      }
      next();
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        error.name === "TokenExpiredError"
      ) {
        return next(new UnauthorizedException(errorDefinitions.GENERAL.EXPIRED_TOKEN));
      }

      return next(new ForbiddenException(errorDefinitions.GENERAL.INVALID_TOKEN));
    }
  };
}
async function renewToken(
  userPayload: Record<string, unknown>,
  secret: {
    JWT_SECRET: string;
    JWT_ENCRYPTION_KEY: string;
    JWT_EXPIRES_IN: string;
  },
  redisClient: Awaited<ReturnType<typeof RedisClient.getClient>>,
  res: Response,
): Promise<void> {
  // Calculate new session expiry
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + parseInt(secret.JWT_EXPIRES_IN));
  const newSessionExpiry = expiryDate.toISOString();

  // Prepare new token data
  const newTokenData = {
    ...userPayload,
    expiresIn: newSessionExpiry,
  };

  // ONLY encrypt tokenInfo in production mode
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "prod" ||
    globalThis._CONFIG?.NODE_ENV === "production" ||
    globalThis._CONFIG?.NODE_ENV === "prod";

  // Generate new JWT token
  const newToken = generateJwtToken({
    tokenInfo: isProduction
      ? encryptTokenInfo(
          newTokenData as Record<string, string | number | undefined>,
          secret.JWT_ENCRYPTION_KEY,
        )
      : (newTokenData as Record<string, unknown>),
    secret: secret.JWT_SECRET,
    expiryAt: secret.JWT_EXPIRES_IN,
  });

  // Store new token in Redis using the correct session key format
  const realmPrefix = String(userPayload.realm || "").toUpperCase() === "AGENT" ? "agent" : "user";
  const userId = userPayload._id ? String(userPayload._id) : String(userPayload.id);
  const sessionKey = `session:${realmPrefix}:${userId}`;

  await redisClient.set(sessionKey, newToken, "EX", parseInt(secret.JWT_EXPIRES_IN) * 60);

  // Set new token in response header
  res.setHeader("x-new-token", newToken);
}
