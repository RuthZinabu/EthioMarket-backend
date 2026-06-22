export interface EnvConfig {
  MONGO_DB_URL: string;
  JWT_SECRET_KEY: string;
  BRANCH_JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_ENCRYPTION_KEY: string;
  TEMP_TOKEN_EXPIRY: string;
  PORT: number;
  SERVER_PUBLIC_KEY: string;
  SERVER_SECRET_KEY: string;
  REDIS_URL: string;
  SEAWEEDFS_FILER_URL: string;
  SEAWEEDFS_PUBLIC_URL: string;
  SEAWEEDFS_FOLDER_NAME: string;
  POSTGRES_DB_URL?: string;
}
