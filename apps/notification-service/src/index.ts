import express from 'express';
import { logger } from '@emacare/shared-utils';
import { initConfig } from './config/init-config';
import initRoutes from './routes';

const app = express();

async function startServer() {
  const config = await initConfig();

  app.use(express.json());

  initRoutes(app);

  app.listen(config.PORT, () => {
    logger.info(`📧 Notification Service running on http://localhost:${config.PORT}`);
  });
}

startServer();

export default app;
