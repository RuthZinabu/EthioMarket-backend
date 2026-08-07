import crypto from "crypto";

/**
 * Recursively sorts keys in an object to ensure deterministic JSON stringification.
 */
function sortObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return obj;
  }
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: any = {};
  for (const key of sortedKeys) {
    sortedObj[key] = sortObjectKeys(obj[key]);
  }
  return sortedObj;
}

/**
 * Verifies a signature for a given payload using a shared secret.
 *
 * @param payload The data to verify (should be an object or string)
 * @param signature The signature to verify against
 * @param secret The shared secret
 * @returns boolean indicating if the signature is valid
 */
export function verifySignature(payload: any, signature: string, secret: string): boolean {
  try {
    const sortedPayload = typeof payload === "object" ? sortObjectKeys(payload) : payload;
    const data = typeof sortedPayload === "string" ? sortedPayload : JSON.stringify(sortedPayload);
    const expectedSignature = crypto.createHmac("sha256", secret).update(data).digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    return false;
  }
}

/**
 * Signs a payload using a shared secret.
 *
 * @param payload The data to sign
 * @param secret The shared secret
 * @returns The signature string
 */
export function signPayload(payload: any, secret: string): string {
  const sortedPayload = typeof payload === "object" ? sortObjectKeys(payload) : payload;
  const data = typeof sortedPayload === "string" ? sortedPayload : JSON.stringify(sortedPayload);
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}
