import { ConnectOptions } from "mongoose";
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
export declare const connectDb: (uri: string, options?: ConnectOptions) => Promise<void>;
export declare const checkDbHealth: () => Promise<HealthCheckResult>;
export declare const checkReplicaSetStatus: () => Promise<void>;
export declare const closeDb: () => Promise<void>;
export {};
//# sourceMappingURL=db-config.d.ts.map