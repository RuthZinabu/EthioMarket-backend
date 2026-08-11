import path from "path";
import dotenv from "dotenv";

import ConfigType, { configSchema } from "../validations/config-schema";
import { logger, VaultService, type EnvConfig } from "@emacare/shared-utils";

dotenv.config({
  path: path.resolve(__dirname, "../../../..", ".env"),
});

export async function initConfig(): Promise<Partial<EnvConfig> | null> {
  try {
    const vaultTokenRaw = process.env.VAULT_TOKEN;
    const vaultAddrRaw = process.env.VAULT_ADDR;
    const vaultPathRaw = process.env.VAULT_PATH;

    const vaultToken = vaultTokenRaw?.trim();
    const vaultAddr = vaultAddrRaw?.trim();
    const vaultPath = vaultPathRaw?.trim();

    const vaultEnabled = Boolean(vaultToken && vaultAddr && vaultPath);

    logger.info("Vault env check", {
      VAULT_TOKEN_present: Boolean(vaultToken),
      VAULT_ADDR_present: Boolean(vaultAddr),
      VAULT_PATH_present: Boolean(vaultPath),
    });

    // Always start with current env
    let result: any = { ...process.env };

    if (vaultEnabled) {
      try {
        const vault = new VaultService({
          token: vaultToken as string,
          endpoint: vaultAddr as string,
          apiVersion: process.env.VAULT_API_VERSION || "v1",
        });
        const vaultSecrets = await vault.getSecret(vaultPath as string);
        result = { ...process.env, ...vaultSecrets };
      } catch (vaultError: any) {
        logger.error(
          "Failed to fetch secrets from Vault, falling back to environment variables",
          vaultError?.message || String(vaultError),
        );
      }
    } else {
      logger.info("Vault config missing: starting with available .env/process.env values");
    }

    if (!vaultEnabled) {
      const port = Number(process.env.PORT ?? 3004);
      return { PORT: Number.isFinite(port) ? port : 3004 };
    }

    let vaultFetchSucceeded = true;

    if (vaultEnabled) {
      try {
        // We keep this conservative; if critical vars are missing, we fallback to PORT.
        const requiredLikeKeys = [
          "MONGO_DB_URL",
          "JWT_SECRET_KEY",
          "JWT_EXPIRES_IN",
          "REDIS_URL",
        ];
        const present = requiredLikeKeys.some((k) => Boolean((result as any)?.[k]));
        vaultFetchSucceeded = present;
      } catch {
        vaultFetchSucceeded = false;
      }

      if (!vaultFetchSucceeded) {
        logger.error(
          "Vault fetch did not provide required config; starting cart-service in PORT-only mode",
        );
        const port = Number(process.env.PORT ?? 3004);
        return { PORT: Number.isFinite(port) ? port : 3004 };
      }
    }


    // If Vault is enabled but the fetched/merged secrets are missing required keys,
    // don't block service startup in dev.

    // Helpful debug to understand why schema validation fails
    const debugKeys = [
      "MONGO_DB_URL",
      "JWT_EXPIRES_IN",
      "JWT_ENCRYPTION_KEY",
      "JWT_SECRET_KEY",
      "REDIS_URL",
      "SEAWEEDFS_FILER_URL",
      "SEAWEEDFS_PUBLIC_URL",
      "SEAWEEDFS_FOLDER_NAME",
    ];
    logger.info("Cart init-config env key presence (before normalize)", {
      present: debugKeys.reduce((acc, k) => {
        acc[k] = Boolean((result as any)?.[k]);
        return acc;
      }, {} as Record<string, boolean>),
    });

    const normalizeForSchema = (input: any) => {
      const out = { ...input };

      // compatibility: allow JWT_SECRET -> JWT_SECRET_KEY
      if (!out.JWT_SECRET_KEY && out.JWT_SECRET) {
        out.JWT_SECRET_KEY = out.JWT_SECRET;
      }

      // compatibility: allow JWT_EXPIRES_IN from JWT_EXPIRES
      if (!out.JWT_EXPIRES_IN && out.JWT_EXPIRES) {
        out.JWT_EXPIRES_IN = out.JWT_EXPIRES;
      }

      return out;
    };

    const vals = configSchema.safeParse(normalizeForSchema(result));
    if (!vals.success) {
      const fallbackResult: any = normalizeForSchema({ ...process.env });

      // If schema still fails, do not block service startup.
      const fallbackVals = configSchema.safeParse(fallbackResult);
      if (!fallbackVals.success) {
        logger.error(
          "Config schema still invalid; starting cart-service in PORT-only mode",
          fallbackVals.error,
        );
        const port = Number(process.env.PORT ?? 3004);
        return { PORT: Number.isFinite(port) ? port : 3004 };
      }

      return mapConfigVals(fallbackVals.data);
    }

    return mapConfigVals(vals.data);

  } catch (error) {
    logger.error("error", error);
    return null;
  }
}

const mapConfigVals = (vals: ConfigType): Partial<EnvConfig> => {
  if (vals.POSTGRES_DB_URL) {
    process.env.POSTGRES_DB_URL = vals.POSTGRES_DB_URL;
    process.env.DATABASE_URL = vals.POSTGRES_DB_URL;
  }

  return {
    MONGO_DB_URL: vals.MONGO_DB_URL,
    JWT_SECRET_KEY: vals.JWT_SECRET_KEY,
    JWT_EXPIRES_IN: vals.JWT_EXPIRES_IN,
    JWT_ENCRYPTION_KEY: vals.JWT_ENCRYPTION_KEY,
    REDIS_URL: vals.REDIS_URL,
    POSTGRES_DB_URL: vals.POSTGRES_DB_URL,
  };
};

