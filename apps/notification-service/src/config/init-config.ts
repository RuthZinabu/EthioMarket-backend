import dotenv from 'dotenv';

dotenv.config();

export interface NotificationConfig {
  PORT: number;
}

export async function initConfig(): Promise<NotificationConfig> {
  const PORT = Number(process.env.PORT || 3007);

  return {
    PORT,
  };
}

export default initConfig;
