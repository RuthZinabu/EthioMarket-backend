import { errorDefinitions, UnauthorizedException } from "../common";
import jwt from "jsonwebtoken";
import { decryptTokenInfo } from "./token";

type SecretKeys = {
  JWT_SECRET: string;
  JWT_ENCRYPTION_KEY: string;
};

export async function customTokenVerify<T = Record<string, unknown>>(
  token: string,
  secret: SecretKeys,
): Promise<T> {
  try {
    const decoded = jwt.verify(token, secret.JWT_SECRET) as {
      data?: string;
      exp?: number;
    };

    if (!decoded?.data || typeof decoded.data !== "string") {
      throw new UnauthorizedException(errorDefinitions.GENERAL.INVALID_TOKEN_FORMAT);
    }

    const decrypted = decryptTokenInfo(decoded.data, secret.JWT_ENCRYPTION_KEY) as T;

    let tokenPayload: T;

    if (typeof decrypted === "string") {
      try {
        tokenPayload = JSON.parse(decrypted);
      } catch (err) {
        console.log(err);
        throw new UnauthorizedException(errorDefinitions.GENERAL.INVALID_TOKEN_FORMAT);
      }
    } else {
      tokenPayload = decrypted;
    }

    return tokenPayload;
  } catch (err) {
    console.log("err", err);
    throw new UnauthorizedException(errorDefinitions.GENERAL.INVALID_TOKEN);
  }
}
