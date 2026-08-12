import dotenv from 'dotenv';

dotenv.config();

export interface OrderConfig {
  PORT: number;
  MONGO_URL: string;
}

export async function initConfig(): Promise<OrderConfig> {
  const PORT = Number(process.env.PORT || 3003);
  const MONGO_URL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/emacare';

  return {
    PORT,
    MONGO_URL,
  };
}

export default initConfig;
