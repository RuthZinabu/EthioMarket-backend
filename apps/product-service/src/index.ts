import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { logger } from "@emacare/shared-utils";

import initRoutes from "./routes/index";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_DB_URL || "mongodb://localhost:27017/emacare";

app.use(express.json());

initRoutes(app);

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    logger.info("Connected to MongoDB for Product Service");
  } catch (err) {
    logger.warn("Could not connect to MongoDB for Product Service", err);
  }

  app.listen(PORT, () => {
    logger.info(`📦 Product Service running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
