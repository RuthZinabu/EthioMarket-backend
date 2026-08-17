import z from "zod";

const optionalNonEmptyString = z.string().min(1).optional();

export const configSchema = z.object({
  MONGO_DB_URL: optionalNonEmptyString,
  JWT_EXPIRES_IN: optionalNonEmptyString,
  JWT_ENCRYPTION_KEY: optionalNonEmptyString,
  JWT_SECRET_KEY: optionalNonEmptyString,
  REDIS_URL: optionalNonEmptyString,

  SEAWEEDFS_FILER_URL: optionalNonEmptyString,
  SEAWEEDFS_PUBLIC_URL: optionalNonEmptyString,
  SEAWEEDFS_FOLDER_NAME: optionalNonEmptyString,

  NODE_ENV: optionalNonEmptyString,
  TEMP_TOKEN_EXPIRY: optionalNonEmptyString,
  PORT: z.coerce.number().optional(),
  PRODUCT_SERVICE_PORT: z.coerce.number().optional(),
  POSTGRES_DB_URL: optionalNonEmptyString,
});

type ConfigType = z.infer<typeof configSchema>;
export default ConfigType;
