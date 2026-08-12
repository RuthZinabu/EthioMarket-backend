import express from 'express';
import mongoose from 'mongoose';
import { logger } from '@emacare/shared-utils';
import { initConfig } from './config/init-config';
import initRoutes from './routes';

const app = express();

async function startServer() {
  const config = await initConfig();

  app.use(express.json());

  initRoutes(app);

  try {
    await mongoose.connect(config.MONGO_URL);
    logger.info('Connected to MongoDB for Shipping Service');
  } catch (err) {
    logger.warn('Could not connect to MongoDB for Shipping Service', err);
  }

  app.listen(config.PORT, () => {
    logger.info(`🚚 Shipping Service running on http://localhost:${config.PORT}`);
  });
}

startServer();

export default app;
