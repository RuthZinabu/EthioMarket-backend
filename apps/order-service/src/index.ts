import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
dotenv.config({ path: ".env" });
import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { initConfig } from "./config/init-config";
import { corsOptions, errorHandler, logger, RedisClient } from "@emacare/shared-utils";
import router from "./routes/index";
import { closeDb, connectDb } from "@emacare/mongo/repository";

const app: Express = express();

async function initializeApp() {
  const configs = await initConfig();
  if (!configs) {
    logger.error("Failed to load environment configuration. Exiting...");
    process.exit(1);
  }
  globalThis._CONFIG = configs;
  if (globalThis._CONFIG.MONGO_DB_URL) {
    await connectDb(globalThis._CONFIG.MONGO_DB_URL, {});
  }
  if (globalThis._CONFIG.REDIS_URL && globalThis._CONFIG.REDIS_URL !== "undefined") {
    RedisClient.initialize({ url: globalThis._CONFIG.REDIS_URL });
  }
}

process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT EXCEPTION!  Shutting down...", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("UNHANDLED REJECTION!  Shutting down...", { reason, promise });
  process.exit(1);
});

// Start server
async function startServer() {
  try {
    await initializeApp(); // Critical setup first

    process.on("SIGTERM", async () => {
      await closeDb();
      process.exit(0);
    });

    app.use(cors(corsOptions));
    app.use(helmet());
    app.disable("x-powered-by");
    app.use(express.json());
    router(app);

    app.use(errorHandler);
    const PORT = globalThis._CONFIG.PORT || process.env.PORT || 3003;
    const ENVIRONMENT = process.env.NODE_ENV || "development";
    app.listen(PORT, () => {
      logger.info(`📋 Order Microservice listening on port ${PORT} in ${ENVIRONMENT} mode.`);
    });
  } catch (error) {
    logger.error("Failed to initialize and start server:", error as Error);
    process.exit(1);
  }
}

startServer();

export default app;
