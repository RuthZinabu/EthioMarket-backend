import dotenv from 'dotenv';

dotenv.config();

export interface PaymentConfig {
  PORT: number;
}

export async function initConfig(): Promise<PaymentConfig> {
  const PORT = Number(process.env.PORT || 3005);

  return {
    PORT,
  };
}

export default initConfig;
