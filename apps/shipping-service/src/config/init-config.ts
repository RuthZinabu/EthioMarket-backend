import { logger, type EnvConfig, VaultService } from "@emacare/shared-utils";
import ConfigType, { configSchema } from "../validations/config-schema";

export async function initConfig(): Promise<Partial<EnvConfig> | null> {
  try {
    let result: any = { ...process.env };
    const vaultPath = process.env.VAULT_PATH;

    if (process.env.VAULT_TOKEN && process.env.VAULT_ADDR && vaultPath) {
      try {
        const vault = new VaultService({
          token: process.env.VAULT_TOKEN,
          endpoint: process.env.VAULT_ADDR,
          apiVersion: process.env.VAULT_API_VERSION || "v1",
        });
        const vaultSecrets = await vault.getSecret(vaultPath);
        result = { ...process.env, ...vaultSecrets };
      } catch (vaultError: any) {
        console.error(
          "Failed to fetch from Vault, falling back to .env only",
          vaultError?.message || String(vaultError),
        );
      }
    } else {
      console.log("Configuration loaded from .env (Vault config missing)");
    }

    const vals = configSchema.safeParse(result);
    if (vals.success) {
      const _envConfigs = mapConfigVals(vals.data);
      return _envConfigs;
    } else {
      console.error("Failed to initialize config", vals.error);
      return null;
    }
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
    PORT: Number(vals.SHIPPING_SERVICE_PORT),
    REDIS_URL: vals.REDIS_URL,
    SEAWEEDFS_FILER_URL: vals.SEAWEEDFS_FILER_URL,
    SEAWEEDFS_PUBLIC_URL: vals.SEAWEEDFS_PUBLIC_URL,
    SEAWEEDFS_FOLDER_NAME: vals.SEAWEEDFS_FOLDER_NAME,
    POSTGRES_DB_URL: vals.POSTGRES_DB_URL,
  };
};

export default initConfig;
