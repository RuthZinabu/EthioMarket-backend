import { PrismaClient } from "../dist/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from the monorepo root
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Vault stores the connection string as POSTGRES_DB_URL; Prisma expects DATABASE_URL.
 */
const datasourceUrl = process.env.DATABASE_URL || process.env.POSTGRES_DB_URL;

const createPrismaClient = () => {
  if (datasourceUrl) {
    const pool = new Pool({ connectionString: datasourceUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV !== "production"
          ? ["query", "info", "warn", "error"]
          : ["error", "warn"],
    });
  }
  return new PrismaClient({
    log:
      process.env.NODE_ENV !== "production"
        ? ["query", "info", "warn", "error"]
        : ["error", "warn"],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
