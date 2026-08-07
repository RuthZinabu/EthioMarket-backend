import { Document } from "mongoose";
import { Types } from "mongoose";
import { Realm } from "./enum";
export declare enum PermissionModule {
    CUSTOMER = "Customer",
    LEDGER = "Ledger",
    AGENT = "Agent",
    PAYABLE_RECEIVABLE = "Payable / Receivable",
    RULE_ENGINE = "Rule Engine",
    RECONCILIATION = "Reconciliation",
    PERMISSION_GROUP = "Permission Group",
    USER = "User",
    AUDIT_LOG = "Audit Log",
    DEPARTMENT = "Department",
    FINANCIAL_INSTITUTION = "Financial Institution"
}
export declare enum PermissionAction {
    CREATE = "Create",
    READ = "Read",
    UPDATE = "Update",
    DISABLE = "Disable",
    APPROVE = "Approve"
}
export declare enum PermissionRole {
    MAKER = "Maker",
    CHECKER = "Checker",
    FULL_AUTHORIZER = "FullAuthorizer"
}
export declare enum ActionResourceType {
    CUSTOMER = "Customer",
    LEDGER = "Ledger",
    AGENT = "Agent",
    PAYABLE_RECEIVABLE = "Payable / Receivable",
    RULE_ENGINE = "Rule Engine",
    RECONCILIATION = "Reconciliation",
    PERMISSION_GROUP = "Permission Group",
    USER = "User",
    AUDIT_LOG = "Audit Log",
    DEPARTMENT = "Department",
    FINANCIAL_INSTITUTION = "Financial Institution"
}
export declare enum ActionRequestOperation {
    CREATE = "Create",
    UPDATE = "Update",
    ENABLE = "Enable",
    DISABLE = "Disable",
    DELETE = "Delete"
}
export declare enum ActionRequestStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected"
}
export interface PermissionType {
    name: string;
    description?: string;
    realm: Realm;
    enabled?: boolean;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IPermission extends Document, PermissionType {
}
export interface ICustomPermission extends Document {
    permission: Types.ObjectId;
    actions: PermissionAction[];
}
export declare const roleActionMap: Record<PermissionRole, PermissionAction[]>;
//# sourceMappingURL=permission.d.ts.map