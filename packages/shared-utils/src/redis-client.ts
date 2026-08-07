import { logger } from "./utils/logger";
import Redis from "ioredis";

export enum RedisValuePairKeys {
  SERVER_PRIVATE_KEY = "SERVER_PRIVATE_KEY",
  SERVER_PUBLIC_KEY = "SERVER_PUBLIC_KEY",
  PG_CACHE_PREFIX = "AUTH:PG:",
}

export class RedisClient {
  private static instance: Redis;
  private static connectionPromise: Promise<void> | null = null;
  private static isInitialized = false;

  public static initialize(config: { url: string }) {
    if (this.isInitialized) return;

    if (!config.url || config.url === "undefined" || config.url.includes("undefined")) {
      logger.error(
        `Invalid Redis URL provided: "${config.url}". Redis client will not be initialized.`,
      );
      return;
    }

    this.instance = new Redis(config.url, {
      connectTimeout: 5000, // Wait 5s for connection
      retryStrategy: (times) => {
        // Only retry if we haven't failed too many times
        if (times > 5) return null; // Stop retrying after 5 attempts
        return Math.min(times * 500, 2000);
      },
      maxRetriesPerRequest: 3,
    });

    this.instance.on("error", (err) => {
      logger.error("Redis Client Error:", err);
    });

    this.connectionPromise = new Promise((resolve, reject) => {
      this.instance.once("connect", () => {
        logger.info("Redis connected successfully");
        this.isInitialized = true;
        resolve();
      });
      this.instance.once("error", reject);
    });
  }

  public static async getClient(): Promise<Redis> {
    if (!this.connectionPromise) {
      throw new Error("Redis client not initialized. Call initialize() method first");
    }

    await this.connectionPromise;
    return this.instance;
  }

  public static async close(): Promise<void> {
    if (this.instance) {
      await this.instance.quit();
      this.isInitialized = false;
      this.connectionPromise = null;
    }
  }

  public static async healthCheck(): Promise<boolean> {
    try {
      const client = await this.getClient();
      return (await client.ping()) === "PONG";
    } catch (error) {
      logger.error("Redis health check failed:", error);
      return false;
    }
  }
}
