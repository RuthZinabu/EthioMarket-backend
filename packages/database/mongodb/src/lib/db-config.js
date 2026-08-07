"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDb = exports.checkReplicaSetStatus = exports.checkDbHealth = exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./logger");
let isConnectedBefore = false;
let healthCheckInterval = null;
// ========== MAIN CONNECT FUNCTION ==========
const connectDb = async (uri, options = {}) => {
    const mergedOptions = {
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
    mongoose_1.default.connection.on("connected", () => {
        isConnectedBefore = true;
        logger_1.logger.info(" MongoDB connected successfully.");
        startReplicaSetMonitoring();
    });
    mongoose_1.default.connection.on("error", (err) => {
        logger_1.logger.error(" MongoDB connection error:", err);
    });
    mongoose_1.default.connection.on("disconnected", () => {
        logger_1.logger.warn(" MongoDB disconnected.");
        if (!isConnectedBefore) {
            logger_1.logger.error(" Initial MongoDB connection failed. Exiting...");
        }
    });
    mongoose_1.default.connection.on("reconnected", () => {
        logger_1.logger.info(" MongoDB reconnected.");
        (0, exports.checkReplicaSetStatus)();
    });
    mongoose_1.default.connection.on("close", () => {
        logger_1.logger.warn(" MongoDB connection closed.");
        stopReplicaSetMonitoring();
    });
    mongoose_1.default.connection.on("fullsetup", () => {
        logger_1.logger.info(" Replica set fully connected.");
    });
    // Graceful shutdown
    process.on("SIGINT", async () => {
        await (0, exports.closeDb)();
        process.exit(0);
    });
    try {
        logger_1.logger.info(` Connecting to MongoDB...,uri: ${uri}`);
        await mongoose_1.default.connect(uri, mergedOptions);
        setTimeout(() => (0, exports.checkReplicaSetStatus)(), 5000);
    }
    catch (error) {
        logger_1.logger.error(" MongoDB connection error:", error);
        process.exit(1);
    }
};
exports.connectDb = connectDb;
// ========== HEALTH CHECK ==========
const checkDbHealth = async () => {
    try {
        const db = mongoose_1.default.connection.db;
        if (!db) {
            logger_1.logger.error(" MongoDB not connected. Skipping health check.");
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
        let replicaMembers = [];
        let setName;
        try {
            const replicaStatus = await adminDb.command({ replSetGetStatus: 1 });
            setName = replicaStatus.set;
            replicaMembers =
                replicaStatus.members?.map((m) => ({
                    name: m.name,
                    stateStr: m.stateStr,
                    health: m.health,
                })) ?? [];
        }
        catch (replicaErr) {
            if (replicaErr.codeName === "NotYetInitialized" ||
                replicaErr.codeName === "NoReplicationEnabled") {
                logger_1.logger.warn("ℹ Not a replica set or not initialized. Skipping replica check.");
            }
            else if (replicaErr.code === 13 ||
                replicaErr.codeName === "Unauthorized") {
                logger_1.logger.warn(" Not authorized to run replSetGetStatus. Skipping replica check.");
            }
            else {
                logger_1.logger.error(" Error while checking replica set:", replicaErr);
            }
        }
        // Test write and delete
        let writeTest = false;
        try {
            const coll = db.collection("health_checks");
            const testDoc = { test: "health_check", timestamp: new Date() };
            const inserted = await coll.insertOne(testDoc);
            if (!inserted.insertedId) {
                logger_1.logger.warn(" Inserted document missing _id. Write test failed.");
            }
            else {
                await coll.deleteOne({ _id: inserted.insertedId });
                writeTest = true;
            }
        }
        catch (err) {
            logger_1.logger.warn(" MongoDB write test failed:", err);
        }
        return {
            status: "ok",
            details: {
                connectionState: "connected",
                poolStats,
                replicaSet: replicaMembers.length > 0
                    ? {
                        setName: setName ?? "unknown",
                        members: replicaMembers,
                    }
                    : undefined,
                writeTest,
            },
        };
    }
    catch (error) {
        logger_1.logger.error(" Health check failed:", error);
        return {
            status: mongoose_1.default.connection.readyState === 1 ? "warning" : "critical",
            details: {
                connectionState: ["disconnected", "connected", "connecting", "disconnecting"][mongoose_1.default.connection.readyState] || "unknown",
                poolStats: {},
                writeTest: false,
            },
        };
    }
};
exports.checkDbHealth = checkDbHealth;
// ========== REPLICA SET MONITORING ==========
const checkReplicaSetStatus = async () => {
    const db = mongoose_1.default.connection.db;
    if (!db) {
        logger_1.logger.warn("🔌 MongoDB not connected. Skipping replica set check.");
        return;
    }
    try {
        const adminDb = db.admin();
        const status = await adminDb.command({ replSetGetStatus: 1 });
        const members = status.members ?? [];
        if (members.length === 0) {
            logger_1.logger.warn("⚠️ Replica set connected, but no members found.");
            return;
        }
        // logger.info(`🔍 Replica Set Name: ${status.set}`);
        // logger.info(`👥 Members: ${members.length}`);
        let healthyCount = 0;
        let hasPrimary = false;
        members.forEach((member) => {
            if (member.health === 1)
                healthyCount++;
            if (member.stateStr === "PRIMARY")
                hasPrimary = true;
        });
        const quorum = Math.floor(members.length / 2) + 1;
        if (!hasPrimary) {
            logger_1.logger.error(" No PRIMARY node found in replica set.");
        }
        if (healthyCount < quorum) {
            logger_1.logger.error(` Quorum lost: only ${healthyCount}/${members.length} healthy members.`);
        }
    }
    catch (err) {
        if (err.code === 13 ||
            err.codeName === "Unauthorized") {
            logger_1.logger.warn(" Not authorized to check replica set. Grant clusterMonitor role.");
        }
        else {
            // logger.error(" Error checking replica set status:", err);
        }
    }
};
exports.checkReplicaSetStatus = checkReplicaSetStatus;
const startReplicaSetMonitoring = (interval = 30000) => {
    if (healthCheckInterval)
        clearInterval(healthCheckInterval);
    healthCheckInterval = setInterval(async () => {
        if (mongoose_1.default.connection.readyState === 1) {
            await (0, exports.checkReplicaSetStatus)();
        }
    }, interval);
};
const stopReplicaSetMonitoring = () => {
    if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
        healthCheckInterval = null;
    }
};
// ========== CLOSE ==========
const closeDb = async () => {
    try {
        stopReplicaSetMonitoring();
        logger_1.logger.info("🔌 MongoDB connection closed gracefully.");
        await mongoose_1.default.connection.close();
        process.exit(0);
    }
    catch (err) {
        logger_1.logger.error("Failed to close MongoDB connection:", err);
    }
};
exports.closeDb = closeDb;
//# sourceMappingURL=db-config.js.map