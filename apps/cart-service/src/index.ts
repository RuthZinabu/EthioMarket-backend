import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { initConfig } from "./config/init-config";
import { logger } from "@emacare/shared-utils";
import cartRoutes from "./routes/cart.routes";

dotenv.config();

const app = express();

async function initializeApp() {
  const configs = await initConfig();

  (globalThis as any)._CONFIG = configs ?? {
    PORT: Number(process.env.PORT ?? 3004),
  };

  const PORT = (globalThis as any)._CONFIG?.PORT ?? process.env.PORT ?? 3004;
  const MONGO_URL = process.env.MONGO_DB_URL || "mongodb://localhost:27017/emacare";

  app.use(express.json());
  app.use("/", cartRoutes);

  try {
    await mongoose.connect(MONGO_URL);
    logger.info("Connected to MongoDB for Cart Service");
  } catch (err) {
    logger.warn("Could not connect to MongoDB for Cart Service", err);
  }

  app.listen(PORT, () => {
    logger.info(`🛒 Cart Service running on http://localhost:${PORT}`);
  });
}

initializeApp();

export default app;
