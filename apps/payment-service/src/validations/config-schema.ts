import z from "zod";

const optionalNonEmptyString = z.string().min(1).optional();

export const configSchema = z.object({
  MONGO_DB_URL: optionalNonEmptyString,
  JWT_EXPIRES_IN: optionalNonEmptyString,
  JWT_ENCRYPTION_KEY: optionalNonEmptyString,
  JWT_SECRET_KEY: optionalNonEmptyString,
  PORT: z.coerce.number().optional(),
  PAYMENT_SERVICE_PORT: z.coerce.number().optional(),
  REDIS_URL: optionalNonEmptyString,

  SEAWEEDFS_FILER_URL: optionalNonEmptyString,
  SEAWEEDFS_PUBLIC_URL: optionalNonEmptyString,
  SEAWEEDFS_FOLDER_NAME: optionalNonEmptyString,

  POSTGRES_DB_URL: optionalNonEmptyString,
});

type ConfigType = z.infer<typeof configSchema>;
export default ConfigType;
