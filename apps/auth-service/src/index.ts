/**
 * @fileoverview Professional Auth Microservice
 * @author ethio-post Development Team
 * @version 1.0.0
 */
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(__dirname, "../../..", ".env") });
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
    globalThis._CONFIG = configs || {
      PORT: Number(process.env.AUTH_SERVICE_PORT || process.env.PORT || 3001),
      MONGO_DB_URL: process.env.MONGODB_URI || "mongodb://localhost:27017/emacare_auth",
    };

    if (globalThis._CONFIG.MONGO_DB_URL) {
      try {
        await connectDb(globalThis._CONFIG.MONGO_DB_URL, {});
      } catch (dbError) {
        logger.error("MongoDB connection warning in Auth Service", dbError as Error);
      }
    }

    // Redis initialization with tracking
    if (globalThis._CONFIG.REDIS_URL && globalThis._CONFIG.REDIS_URL !== "undefined") {
      try {
        RedisClient.initialize({ url: globalThis._CONFIG.REDIS_URL });
      } catch (redisError) {
        logger.error("Redis initialization warning in Auth Service", redisError as Error);
      }
    }
  } catch (error) {
    console.log("error initializing app", error);
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
