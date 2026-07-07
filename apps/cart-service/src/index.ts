import express from "express";
import dotenv from "dotenv";
import { initConfig } from "./config/init-config";
import { logger } from "@emacare/shared-utils";

dotenv.config();

const app = express();

async function initializeApp() {
  const configs = await initConfig();

  (globalThis as any)._CONFIG = configs ?? {
    PORT: Number(process.env.PORT ?? 3004),
  };

  const PORT = (globalThis as any)._CONFIG?.PORT ?? process.env.PORT ?? 3004;

  app.use(express.json());

  app.listen(PORT, () => {
    logger.info(`🛒 Cart Service running on http://localhost:${PORT}`);
  });
}

initializeApp();

export default app;


