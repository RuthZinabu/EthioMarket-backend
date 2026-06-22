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
          "Failed to fetch secrets from Vault, falling back to .env only",
          vaultError?.message || String(vaultError),
        );
      }
    } else {
      logger.info("Vault config missing: starting with available .env/process.env values");
    }

    // If Vault is not enabled, avoid hard-failing on missing required keys.
    // Cart-service currently only needs PORT to start.
    if (!vaultEnabled) {
      const port = Number(process.env.PORT ?? 3004);
      return { PORT: Number.isFinite(port) ? port : 3004 };
    }

    const vals = configSchema.safeParse(result);
    if (!vals.success) {
      // Vault enabled but secrets missing keys expected by schema.
      // Fall back to whatever is in process.env (from .env) and avoid hard-failing in dev.
      logger.error(
        "Failed to initialize config from Vault result; falling back to .env/process.env",
        vals.error,
      );

      const fallbackResult: any = { ...process.env };

      // compatibility: allow JWT_SECRET -> JWT_SECRET_KEY
      if (!fallbackResult.JWT_SECRET_KEY && fallbackResult.JWT_SECRET) {
        fallbackResult.JWT_SECRET_KEY = fallbackResult.JWT_SECRET;
      }

      // compatibility: allow JWT_EXPIRES_IN from JWT_EXPIRES
      if (!fallbackResult.JWT_EXPIRES_IN && fallbackResult.JWT_EXPIRES) {
        fallbackResult.JWT_EXPIRES_IN = fallbackResult.JWT_EXPIRES;
      }

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
    SEAWEEDFS_FILER_URL: vals.SEAWEEDFS_FILER_URL,
    SEAWEEDFS_PUBLIC_URL: vals.SEAWEEDFS_PUBLIC_URL,
    SEAWEEDFS_FOLDER_NAME: vals.SEAWEEDFS_FOLDER_NAME,
    POSTGRES_DB_URL: vals.POSTGRES_DB_URL,
  };
};

