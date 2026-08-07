import mongoose, { ConnectOptions } from "mongoose";
import { logger } from "./logger";

let isConnectedBefore = false;
let healthCheckInterval: ReturnType<typeof setInterval> | null = null;

// ========== TYPES ==========
interface ReplicaMember {
  name: string;
  stateStr: string;
  health: number;
}

interface HealthCheckResult {
  status: "ok" | "warning" | "critical";
  details: {
    replicaSet?: {
      setName: string;
      members: ReplicaMember[];
    };
    connectionState: string;
    poolStats: Record<string, unknown>;
    writeTest?: boolean;
  };
}

// ========== MAIN CONNECT FUNCTION ==========
export const connectDb = async (uri: string, options: ConnectOptions = {}): Promise<void> => {
  const mergedOptions: ConnectOptions = {
    maxPoolSize: 100,
    minPoolSize: 0,
    waitQueueTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000, // Fail faster if server is unreachable
    socketTimeoutMS: 30000,
    heartbeatFrequencyMS: 10000,
    maxIdleTimeMS: 30000,
    retryWrites: true,
    retryReads: true,
    readPreference: "secondaryPreferred",
    ...options,
  };

  // Connection Events
  mongoose.connection.on("connected", () => {
    isConnectedBefore = true;
    logger.info(" MongoDB connected successfully.");
    startReplicaSetMonitoring();
  });

  mongoose.connection.on("error", (err) => {
    logger.error(" MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn(" MongoDB disconnected.");
    if (!isConnectedBefore) {
      logger.error(" Initial MongoDB connection failed. Exiting...");
    }
  });

  mongoose.connection.on("reconnected", () => {
    logger.info(" MongoDB reconnected.");
    checkReplicaSetStatus();
  });

  mongoose.connection.on("close", () => {
    logger.warn(" MongoDB connection closed.");
    stopReplicaSetMonitoring();
  });

  mongoose.connection.on("fullsetup", () => {
    logger.info(" Replica set fully connected.");
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await closeDb();

    process.exit(0);
  });

  try {
    logger.info(` Connecting to MongoDB...,uri: ${uri}`);
    await mongoose.connect(uri, mergedOptions);
    setTimeout(() => checkReplicaSetStatus(), 5000);
  } catch (error) {
    logger.error(" MongoDB connection error:", error);
    process.exit(1);
  }
};

// ========== HEALTH CHECK ==========
export const checkDbHealth = async (): Promise<HealthCheckResult> => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      logger.error(" MongoDB not connected. Skipping health check.");
      return {
        status: "critical",
        details: {
          connectionState: "disconnected",
          poolStats: {},
          writeTest: false,
        },
      };
    }

    const adminDb = db.admin();

    // Ping the server
    await adminDb.ping();

    // Server status info
    const serverStatus = await adminDb.serverStatus();
    const poolStats = {
      connections: serverStatus.connections,
      opcounters: serverStatus.opcounters,
      mem: serverStatus.mem,
    };

    // Replica set info
    let replicaMembers: ReplicaMember[] = [];
    let setName: string | undefined;

    try {
      const replicaStatus = await adminDb.command({ replSetGetStatus: 1 });
      setName = replicaStatus.set;
      replicaMembers =
        replicaStatus.members?.map((m: { name: string; stateStr: string; health: number }) => ({
          name: m.name,
          stateStr: m.stateStr,
          health: m.health,
        })) ?? [];
    } catch (replicaErr) {
      if (
        (replicaErr as { codeName: string }).codeName === "NotYetInitialized" ||
        (replicaErr as { codeName: string }).codeName === "NoReplicationEnabled"
      ) {
        logger.warn("ℹ Not a replica set or not initialized. Skipping replica check.");
      } else if (
        (replicaErr as { code: number }).code === 13 ||
        (replicaErr as { codeName: string }).codeName === "Unauthorized"
      ) {
        logger.warn(" Not authorized to run replSetGetStatus. Skipping replica check.");
      } else {
        logger.error(" Error while checking replica set:", replicaErr);
      }
    }

    // Test write and delete
    let writeTest = false;
    try {
      const coll = db.collection("health_checks");
      const testDoc = { test: "health_check", timestamp: new Date() };
      const inserted = await coll.insertOne(testDoc);

      if (!inserted.insertedId) {
        logger.warn(" Inserted document missing _id. Write test failed.");
      } else {
        await coll.deleteOne({ _id: inserted.insertedId });
        writeTest = true;
      }
    } catch (err) {
      logger.warn(" MongoDB write test failed:", err);
    }

    return {
      status: "ok",
      details: {
        connectionState: "connected",
        poolStats,
        replicaSet:
          replicaMembers.length > 0
            ? {
                setName: setName ?? "unknown",
                members: replicaMembers,
              }
            : undefined,
        writeTest,
      },
    };
  } catch (error) {
    logger.error(" Health check failed:", error);
    return {
      status: mongoose.connection.readyState === 1 ? "warning" : "critical",
      details: {
        connectionState:
          ["disconnected", "connected", "connecting", "disconnecting"][
            mongoose.connection.readyState
          ] || "unknown",
        poolStats: {},
        writeTest: false,
      },
    };
  }
};

// ========== REPLICA SET MONITORING ==========

export const checkReplicaSetStatus = async (): Promise<void> => {
  const db = mongoose.connection.db;
  if (!db) {
    logger.warn("🔌 MongoDB not connected. Skipping replica set check.");
    return;
  }

  try {
    const adminDb = db.admin();
    const status = await adminDb.command({ replSetGetStatus: 1 });

    const members = status.members ?? [];
    if (members.length === 0) {
      logger.warn("⚠️ Replica set connected, but no members found.");
      return;
    }

    // logger.info(`🔍 Replica Set Name: ${status.set}`);
    // logger.info(`👥 Members: ${members.length}`);

    let healthyCount = 0;
    let hasPrimary = false;

    members.forEach((member: { name: string; stateStr: string; health: number }) => {
      if (member.health === 1) healthyCount++;
      if (member.stateStr === "PRIMARY") hasPrimary = true;
    });

    const quorum = Math.floor(members.length / 2) + 1;

    if (!hasPrimary) {
      logger.error(" No PRIMARY node found in replica set.");
    }
    if (healthyCount < quorum) {
      logger.error(` Quorum lost: only ${healthyCount}/${members.length} healthy members.`);
    }
  } catch (err) {
    if (
      (err as { code: number }).code === 13 ||
      (err as { codeName: string }).codeName === "Unauthorized"
    ) {
      logger.warn(" Not authorized to check replica set. Grant clusterMonitor role.");
    } else {
      // logger.error(" Error checking replica set status:", err);
    }
  }
};

const startReplicaSetMonitoring = (interval = 30000): void => {
  if (healthCheckInterval) clearInterval(healthCheckInterval);
  healthCheckInterval = setInterval(async () => {
    if (mongoose.connection.readyState === 1) {
      await checkReplicaSetStatus();
    }
  }, interval);
};

const stopReplicaSetMonitoring = (): void => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
};

// ========== CLOSE ==========
export const closeDb = async (): Promise<void> => {
  try {
    stopReplicaSetMonitoring();
    logger.info("🔌 MongoDB connection closed gracefully.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    logger.error("Failed to close MongoDB connection:", err);
  }
};
