import { errorDefinitions, ForbiddenException, UnauthorizedException } from "../common";
import {
  IUser,
  PermissionAction,
  PermissionModule,
  Realm,
  UserRole,
} from "@emacare/mongo/types";
import type { NextFunction, Response } from "express";
import { AuthRequest } from "./authenticate";

export type RequiredPermission =
  | string
  | { name: PermissionModule; action: PermissionAction }
  | "*";

function toSet<T extends string>(arr: T[]): Set<T> {
  return new Set(arr);
}

function hasRequiredPermission(
  required: RequiredPermission,
  userPermissions: Record<string, string[]>,
): boolean {
  if (required === "*") return true;

  if (typeof required === "string") {
    return Object.prototype.hasOwnProperty.call(userPermissions, required);
  }

  const userActions = userPermissions[required.name];
  if (!userActions) return false;

  return userActions.includes(required.action) || userActions.includes("*");
}

function getPermissionName(value: unknown): string | undefined {
  if (typeof value === "string") return value;

  if (!value || typeof value !== "object") return undefined;

  const name = (value as { name?: unknown }).name;

  return typeof name === "string" ? name : undefined;
}

function getActions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function buildUserPermissionMap(user: IUser): Record<string, string[]> {
  const map: Record<string, string[]> = {};

  const addPermission = (permName?: string, actionsRaw?: unknown) => {
    if (!permName) return;

    if (!map[permName]) map[permName] = [];

    const set = new Set(map[permName]);
    const actions = getActions(actionsRaw);

    for (const action of actions) set.add(action);

    map[permName] = [...set];
  };

  const additionalPermissions = (user as { additionalPermission?: unknown })?.additionalPermission;

  if (Array.isArray(additionalPermissions)) {
    for (const p of additionalPermissions) {
      const permName = getPermissionName((p as { permission?: unknown })?.permission);

      addPermission(permName, (p as { actions?: unknown })?.actions);
    }
  }

  return map;
}

function createAuthorizationMiddleware(
  realms: (Realm | "*")[],
  permissions: RequiredPermission[],
  roles: (UserRole | "*")[],
  needLoginToken = false,
) {
  const allowAllRealms = realms.includes("*");
  const allowAllPermissions = permissions.includes("*");

  const allowAllRoles = roles.length === 0 || (roles.length === 1 && roles[0] === "*");

  const realmSet = allowAllRealms ? null : toSet(realms as Realm[]);
  const roleSet = allowAllRoles ? null : toSet(roles as UserRole[]);

  return async function middleware(req: AuthRequest, _res: Response, next: NextFunction) {
    const user = req._user;

    //@ts-ignore
    const logger = global.logger || console;
    logger.info("Authorization middleware check", {
      hasUser: !!user,
      userId: (user as any)?._id || (user as any)?.id,
      realm: (user as any)?.realm,
      needLoginToken,
      isMainToken: (user as any)?.isMainToken,
      organizationId: (user as any)?.organizationId,
    });

    if (!user) {
      return next(new UnauthorizedException(errorDefinitions.GENERAL.UNAUTHORIZED));
    }

    if (needLoginToken && !user.isMainToken) {
      return next(new UnauthorizedException(errorDefinitions.GENERAL.UNAUTHORIZED));
    }

    if (!user.realm) {
      return next(new ForbiddenException(errorDefinitions.GENERAL.USER_REALM_NOT_FOUND));
    }

    if (!allowAllRealms && realmSet && !realmSet.has(user.realm as Realm)) {
      return next(new ForbiddenException(errorDefinitions.GENERAL.ACTION_NOT_ALLOWED));
    }

    if (!allowAllPermissions) {
      const userPerms = buildUserPermissionMap(user as IUser);

      const allowed = permissions.some((p) => hasRequiredPermission(p, userPerms));

      if (!allowed) {
        return next(new ForbiddenException(errorDefinitions.GENERAL.ACTION_NOT_ALLOWED));
      }
    }

    if (!allowAllRoles && roleSet && user.role !== undefined) {
      if (!roleSet.has(user.role as UserRole)) {
        return next(new ForbiddenException(errorDefinitions.GENERAL.ACTION_NOT_ALLOWED));
      }
    }

    next();
  };
}

export function authorization(
  realms: (Realm | "*")[],
  permissions: RequiredPermission[],
  roles: (UserRole | "*")[] = [],
  needLoginToken = false,
) {
  return createAuthorizationMiddleware(realms, permissions, roles, needLoginToken);
}
