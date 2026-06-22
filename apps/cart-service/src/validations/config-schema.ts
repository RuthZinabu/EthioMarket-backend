import z from "zod";

export const configSchema = z.object({
  MONGO_DB_URL: z.string().min(1, { message: "Mongo connection string is required" }),
  JWT_EXPIRES_IN: z.string().min(1, { message: "JWT expire is required" }),
  JWT_ENCRYPTION_KEY: z.coerce
    .string()
    .min(1, {
      message: "JWT token encryption is required and must be 32 bytes",
    })
    .min(1, {
      message: "JWT token encryption is required and must be 32 bytes",
    }),
  JWT_SECRET_KEY: z.string().min(1, { message: "JWT secret is required" }),
  REDIS_URL: z.string().min(1, { message: "Redis URL is required" }),
  // SeaweedFS
  SEAWEEDFS_FILER_URL: z.string().min(1, { message: "SeaweedFS file url is required" }),
  SEAWEEDFS_PUBLIC_URL: z.string().min(1, { message: "SeaweedFS public url is required" }),
  SEAWEEDFS_FOLDER_NAME: z.string().min(1, { message: "SeaweedFS folder name is required" }),
  BRANCH_JWT_SECRET: z.string().min(1, { message: "Branch JWT secret is required" }),
  POSTGRES_DB_URL: z.string().optional(),
});

type ConfigType = z.infer<typeof configSchema>;
export default ConfigType;
