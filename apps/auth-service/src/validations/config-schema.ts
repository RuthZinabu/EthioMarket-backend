import z from "zod";

const optionalNonEmptyString = z.string().min(1).optional();

export const configSchema = z.object({
  MONGO_DB_URL: z.string().min(1, { message: "Mongo connection string is required" }),
  JWT_EXPIRES_IN: z.string().min(1, { message: "JWT expire is required" }),
  JWT_ENCRYPTION_KEY: z.string().min(1, { message: "JWT encryption key is required" }),
  JWT_SECRET_KEY: z.string().min(1, { message: "JWT secret is required" }),
  AUTH_MS_PORT: z.number().min(1, { message: "Auth MS port is required" }),
  REDIS_URL: z.string().min(1, { message: "Redis URL is required" }),

  SMS_URL: z.string().min(1, { message: "SMS URL is required" }),
  SMS_SENDER: z.string().min(1, { message: "SMS sender is required" }),
  SMS_TOKEN: z.string().min(1, { message: "SMS token is required" }),
  RABBIT_MQ_HOST: optionalNonEmptyString,
  RABBIT_MQ_PORT: z.coerce.number().min(1).optional(),
  RABBIT_MQ_USERNAME: optionalNonEmptyString,
  RABBIT_MQ_PASSWORD: optionalNonEmptyString,
  RABBIT_MQ_VHOST: optionalNonEmptyString,
  NODE_ENV: z.string().optional(),
  TEMP_TOKEN_EXPIRY: z.string().optional(),
});

type ConfigType = z.infer<typeof configSchema>;
export default ConfigType;
