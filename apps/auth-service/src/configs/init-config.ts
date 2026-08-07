import { logger } from "@emacare/shared-utils";
import { type EnvConfig } from "@emacare/shared-utils";
import ConfigType, { configSchema } from "../validations/config-schema";
import { VaultService } from "@emacare/shared-utils";

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
        // Prioritize vault secrets over local .env variables
        result = { ...process.env, ...vaultSecrets };
        console.log("Configuration merged from Vault and .env");
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
    //console.log("configuration is correct ",vals.error);
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

const mapConfigVals = (vals: ConfigType): Partial<EnvConfig> => ({
  MONGO_DB_URL: vals.MONGO_DB_URL,
  JWT_ENCRYPTION_KEY: vals.JWT_ENCRYPTION_KEY,
  JWT_SECRET_KEY: vals.JWT_SECRET_KEY,
  JWT_EXPIRES_IN: vals.JWT_EXPIRES_IN,
  PORT: Number(vals.AUTH_MS_PORT),
  REDIS_URL: vals.REDIS_URL,
  SMS_URL: vals.SMS_URL,
  SMS_SENDER: vals.SMS_SENDER,
  SMS_TOKEN: vals.SMS_TOKEN,
  RABBIT_MQ_HOST: vals.RABBIT_MQ_HOST,
  RABBIT_MQ_PORT: vals.RABBIT_MQ_PORT,
  RABBIT_MQ_USERNAME: vals.RABBIT_MQ_USERNAME,
  RABBIT_MQ_PASSWORD: vals.RABBIT_MQ_PASSWORD,
  RABBIT_MQ_VHOST: vals.RABBIT_MQ_VHOST,
  NODE_ENV: vals.NODE_ENV,
  TEMP_TOKEN_EXPIRY: vals.TEMP_TOKEN_EXPIRY,
  BRANCH_SERVICE_SECRET: vals.BRANCH_SERVICE_SECRET,
  BRANCH_SERVICE_SIGNATURE: vals.BRANCH_SERVICE_SIGNATURE,
  BRANCH_JWT_SECRET: vals.BRANCH_JWT_SECRET,
});
