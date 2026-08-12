import { logger } from "@emacare/shared-utils";
import { type EnvConfig } from "@emacare/shared-utils";
import ConfigType, { configSchema } from "../validations/config-schema";
import { VaultService } from "@emacare/shared-utils";

export async function initConfig(): Promise<Partial<EnvConfig>> {
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
          "Failed to fetch from Vault, falling back to environment variables",
          vaultError?.message || String(vaultError),
        );
      }
    } else {
      console.log("Configuration loaded from .env (Vault config missing)");
    }

    // Supply sensible fallbacks for development if Vault or process.env values are missing
    result.MONGO_DB_URL = result.MONGO_DB_URL || process.env.MONGODB_URI || "mongodb://localhost:27017/emacare_auth";
    result.JWT_EXPIRES_IN = result.JWT_EXPIRES_IN || "1d";
    result.JWT_ENCRYPTION_KEY = result.JWT_ENCRYPTION_KEY || "emacare-encryption-key-32-chars-long!";
    result.JWT_SECRET_KEY = result.JWT_SECRET_KEY || process.env.JWT_SECRET || "emacare-jwt-secret";
    result.AUTH_MS_PORT = Number(result.AUTH_MS_PORT || process.env.AUTH_SERVICE_PORT || process.env.PORT || 3001);
    result.REDIS_URL = result.REDIS_URL || process.env.REDIS_URL || "redis://localhost:6379";
    result.SMS_URL = result.SMS_URL || "http://localhost:8080/sms";
    result.SMS_SENDER = result.SMS_SENDER || "EMACARE";
    result.SMS_TOKEN = result.SMS_TOKEN || "mock-sms-token";

    const vals = configSchema.safeParse(result);
    if (vals.success) {
      const _envConfigs = mapConfigVals(vals.data);
      return _envConfigs;
    } else {
      console.error("Config validation warning, using merged fallback values:", vals.error);
      return {
        MONGO_DB_URL: result.MONGO_DB_URL,
        JWT_ENCRYPTION_KEY: result.JWT_ENCRYPTION_KEY,
        JWT_SECRET_KEY: result.JWT_SECRET_KEY,
        JWT_EXPIRES_IN: result.JWT_EXPIRES_IN,
        PORT: Number(result.AUTH_MS_PORT),
        REDIS_URL: result.REDIS_URL,
        SMS_URL: result.SMS_URL,
        SMS_SENDER: result.SMS_SENDER,
        SMS_TOKEN: result.SMS_TOKEN,
      };
    }
  } catch (error) {
    logger.error("Error initializing auth-service config, using defaults", error as Error);
    return {
      PORT: Number(process.env.AUTH_SERVICE_PORT || process.env.PORT || 3001),
      MONGO_DB_URL: process.env.MONGODB_URI || "mongodb://localhost:27017/emacare_auth",
    };
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
});
