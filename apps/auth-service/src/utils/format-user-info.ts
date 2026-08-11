import { IUser } from "@emacare/mongo/types";
import { AuthToken, generateJwtToken } from "@emacare/shared-utils";
import { _UserToken, encryptTokenInfo } from "@emacare/shared-utils";
import { FlattenMaps } from "mongoose";

export function formatUserInfo(
  user: Partial<IUser> | FlattenMaps<IUser>,
  additionalInfo?: Partial<AuthToken>,
  tokenExpiry?: number,
  isMainToken = false,
) {
  const _tokenInfo: _UserToken = {
    _id: user?._id,
    userCode: user?.userCode,
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
    firstName: user?.firstName,
    middleName: user?.middleName,
    lastName: user?.lastName,
    realm: user?.realm,
    role: user.role,
    organization:
      user?.organization ||
      (user as any).organization?._id?.toString() ||
      (user as any).organization?.toString(),
    isMainToken,
    isSetPassword: user.isSetPassword,
    permissionGroup: user?.permissionGroup,
    additionalPermissions: user.additionalPermissions || [],
  };
  const userInfo: { [kye: string]: string | undefined | number | unknown } = {
    id: user?._id,
    userCode: user?.userCode,
    firstName: user?.firstName,
    middleName: user?.middleName,
    lastName: user?.lastName,
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
    avatar: user.avatar || "",
    realm: user?.realm,
    role: user.role,
    organization: user?.organization || "",
    permissionGroup: user?.permissionGroup,
    additionalPermissions: user.additionalPermissions || [],
  };

  const calculateExpiry = (expiresIn: string | number): Date => {
    const date = new Date();
    if (typeof expiresIn === "number") {
      date.setSeconds(
        date.getSeconds() + (expiresIn > 1000 ? Math.floor(expiresIn / 1000) : expiresIn * 60),
      );
      return date;
    }
    const value = parseInt(expiresIn.slice(0, -1));
    const unit = expiresIn.slice(-1);
    switch (unit) {
      case "s":
        date.setSeconds(date.getSeconds() + value);
        break;
      case "m":
        date.setMinutes(date.getMinutes() + value);
        break;
      case "h":
        date.setHours(date.getHours() + value);
        break;
      case "d":
        date.setDate(date.getDate() + value);
        break;
      default: {
        const rawValue = parseInt(expiresIn);
        // If it's a raw number, assume minutes
        date.setMinutes(date.getMinutes() + (isNaN(rawValue) ? 30 : rawValue));
        break;
      }
    }
    return date;
  };

  const expiryDate = tokenExpiry
    ? new Date(Date.now() + tokenExpiry)
    : calculateExpiry(globalThis._CONFIG?.JWT_EXPIRES_IN || "30m");

  const tokenPayload = {
    ..._tokenInfo,
    ...additionalInfo,
    expiresIn: expiryDate.toISOString(),
  };

  // ONLY encrypt tokenInfo in production mode
  const isProduction =
    globalThis._CONFIG?.NODE_ENV === "production" || process.env.NODE_ENV === "production";

  const tokenInfo = isProduction
    ? encryptTokenInfo(tokenPayload as any, globalThis._CONFIG?.JWT_ENCRYPTION_KEY)
    : tokenPayload;
  const userToken = generateJwtToken({
    tokenInfo,
    secret: globalThis._CONFIG.JWT_SECRET_KEY!,
    expiryAt: tokenExpiry ?? globalThis._CONFIG.JWT_EXPIRES_IN,
  });
  return { userToken, userInfo };
}

export function getJwtExpiresInSeconds(): number {
  const expiresIn = globalThis._CONFIG?.JWT_EXPIRES_IN || "100m";
  const value = parseInt(expiresIn.slice(0, -1));
  const unit = expiresIn.slice(-1);

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 60 * 60 * 24;
    default: {
      const rawValue = parseInt(expiresIn);
      // Default to minutes if no unit provided
      return (isNaN(rawValue) ? 30 : rawValue) * 60;
    }
  }
}
