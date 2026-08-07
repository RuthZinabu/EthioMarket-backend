import crypto from "crypto";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
const IV_LENGTH = 16;
//AES-256-GCM encryption algorithm
export const encryptTokenInfo = (
  val: Record<string, string | number | undefined | boolean>,
  encryptionKey: string | undefined,
): string => {
  if (!encryptionKey) throw new Error("Encryption key is required");
  const ENCRYPTION_KEY = Buffer.from(encryptionKey, "hex");

  if (ENCRYPTION_KEY.length !== 32) {
    throw new Error("Encryption key must be 32 bytes (64 hex chars)");
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);

  const jsonString = JSON.stringify(val);
  let encrypted = cipher.update(jsonString, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}.${encrypted}.${authTag}`;
};
export const decryptTokenInfo = (
  encryptedToken: string,
  encryptionKey: string,
): Record<string, string | number | undefined> => {
  const [ivHex, encrypted, authTagHex] = encryptedToken.split(".");
  const ENCRYPTION_KEY = Buffer.from(encryptionKey, "hex");
  if (!ivHex || !encrypted || !authTagHex) {
    throw new Error("Invalid encrypted token format");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
};
export function generateJwtToken(config: {
  tokenInfo: Record<string, unknown> | string;
  secret: string;
  expiryAt?: number | string;
}) {
  let expiryTime: string | number = "30m";
  if (typeof config.expiryAt === "string") {
    expiryTime = config.expiryAt;
  } else if (typeof config.expiryAt === "number") {
    // If it's a large number, assume it's milliseconds and convert to seconds
    expiryTime =
      config.expiryAt > 1000000000 ? Math.floor(config.expiryAt / 1000) : config.expiryAt;
  }
  const _token = jwt.sign(
    {
      data: config.tokenInfo,
    },
    config.secret as Secret,
    { expiresIn: expiryTime as any },
  );
  return _token;
}
