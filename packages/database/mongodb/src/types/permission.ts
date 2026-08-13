import { Document, Types } from "mongoose";
import { Realm } from "./enum";

export enum PermissionModule {
  CUSTOMER = "Customer",
  VENDOR = "Vendor",
  VENDOR_PAYOUT = "Vendor Payout",
  PRODUCT = "Product",
  ORDER = "Order",
  SHIPMENT = "Shipment",
  PERMISSION_GROUP = "Permission Group",
  USER = "User",
  AUDIT_LOG = "Audit Log",
  DEPARTMENT = "Department",
}

export enum PermissionAction {
  CREATE = "Create",
  READ = "Read",
  UPDATE = "Update",
  DISABLE = "Disable",
  APPROVE = "Approve",
}

export enum PermissionRole {
  MAKER = "Maker",
  CHECKER = "Checker",
  FULL_AUTHORIZER = "FullAuthorizer",
}

export enum ActionResourceType {
  CUSTOMER = "Customer",
  VENDOR = "Vendor",
  VENDOR_PAYOUT = "Vendor Payout",
  PRODUCT = "Product",
  ORDER = "Order",
  SHIPMENT = "Shipment",
  PERMISSION_GROUP = "Permission Group",
  USER = "User",
  AUDIT_LOG = "Audit Log",
  DEPARTMENT = "Department",
}

export enum ActionRequestOperation {
  CREATE = "Create",
  UPDATE = "Update",
  ENABLE = "Enable",
  DISABLE = "Disable",
  DELETE = "Delete",
}

export enum ActionRequestStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
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

export interface IPermission extends PermissionType {}
export interface PermissionDocument extends IPermission, Document {}

export interface ICustomPermission extends Document {
  permission: Types.ObjectId;
  actions: PermissionAction[];
}

export const roleActionMap: Record<PermissionRole, PermissionAction[]> = {
  [PermissionRole.MAKER]: [PermissionAction.CREATE, PermissionAction.READ, PermissionAction.UPDATE],
  [PermissionRole.CHECKER]: [PermissionAction.READ, PermissionAction.APPROVE],
  [PermissionRole.FULL_AUTHORIZER]: [
    PermissionAction.CREATE,
    PermissionAction.READ,
    PermissionAction.UPDATE,
    PermissionAction.APPROVE,
    PermissionAction.DISABLE,
  ],
};
