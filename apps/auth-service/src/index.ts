/**
 * @fileoverview Professional Auth Microservice
 * @author ethio-post Development Team
 * @version 1.0.0
 */
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { corsOptions, errorHandler, logger, NotFoundException } from "@emacare/shared-utils";
import { connectDb } from "@emacare/mongo/repository";
import { RedisClient} from "@emacare/shared-utils";
import { runSeed } from "./configs";
import { initConfig } from "./configs/init-config";
import cors from "cors";
import helmet from "helmet";
import express, { type Express, type Request, type Response } from "express";
import router from "./routes/index";

const app: Express = express();

async function initializeApp() {
  try {
    const configs = await initConfig();
    if (!configs) {
      logger.error("Failed to load environment configuration. Exiting...");
      process.exit(1);
    }
    globalThis._CONFIG = configs;

    await connectDb(globalThis._CONFIG.MONGO_DB_URL!, {});

    // Redis initialization with tracking
    if (globalThis._CONFIG.REDIS_URL && globalThis._CONFIG.REDIS_URL !== "undefined") {
      RedisClient.initialize({ url: globalThis._CONFIG.REDIS_URL });
    }
  } catch (error) {
    console.log("error", error);
  }
}

// Graceful shutdown handler
async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  try {
    process.exit(0);
  } catch (error) {
    logger.error("Error during graceful shutdown", error as Error);
    process.exit(1);
  }
}

process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT EXCEPTION!  Shutting down...", error);
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...", { reason, promise });
  gracefulShutdown("unhandledRejection");
});

// Handle termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start server
async function startServer() {
  try {
    await initializeApp();

    // Express app configuration
    app.use(cors(corsOptions));
    app.use(helmet());
    app.disable("x-powered-by");
    app.use(express.json());

    router(app);

    app.use("*", (_req: Request, _res: Response) => {
      throw new NotFoundException({ message: "Route not found" });
    });
    app.use(errorHandler);

    setTimeout(() => {
      runSeed();
    }, 2000);

    const PORT = globalThis._CONFIG.PORT;
    const ENVIRONMENT = process.env.NODE_ENV || "development";

    app.listen(PORT, () => {
      logger.info(` Auth Microservice listening on port ${PORT} in ${ENVIRONMENT} mode.`);
    });
  } catch (error) {
    logger.error("Failed to initialize and start server", error as Error);
    process.exit(1);
  }
}

startServer();

export default app;
