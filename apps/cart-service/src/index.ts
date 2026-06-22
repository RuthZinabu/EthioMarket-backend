import express from 'express';
import dotenv from 'dotenv';
import initRoutes from './routes';
import { initConfig } from './config/init-config';
import { logger } from '@emacare/shared-utils';

dotenv.config();

// Ensure env is loaded into process.env (some environments may start without .env)
import("dotenv").then(({ config }) => config());

const app = express();

async function initializeApp() {
  const configs = await initConfig();
  if (!configs) {
    logger.error('Failed to load environment configuration. Exiting...');
    process.exit(1);
  }
  (globalThis as any)._CONFIG = configs;
}

initializeApp();

const PORT = (globalThis as any)._CONFIG?.PORT ?? process.env.PORT ?? 3004;

app.use(express.json());

initRoutes(app);

app.listen(PORT, () => {
  logger.info(`🛒 Cart Service running on http://localhost:${PORT}`);
});

export default app;

