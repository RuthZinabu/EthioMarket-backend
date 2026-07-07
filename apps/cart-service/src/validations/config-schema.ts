import z from "zod";

export const configSchema = z.object({
  // Keep these optional so cart-service can boot in dev/PORT-only mode
  MONGO_DB_URL: z.string().min(1).optional(),
  JWT_EXPIRES_IN: z.string().min(1).optional(),
  JWT_ENCRYPTION_KEY: z.coerce
    .string()
    .min(1, {
      message: "JWT token encryption is required and must be 32 bytes",
    })
    .optional(),
  JWT_SECRET_KEY: z.string().min(1).optional(),
  REDIS_URL: z.string().min(1).optional(),

  POSTGRES_DB_URL: z.string().optional(),
});


type ConfigType = z.infer<typeof configSchema>;
export default ConfigType;
