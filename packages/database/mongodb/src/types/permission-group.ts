import { Document, Types } from "mongoose";
import { Realm, Status } from "./enum";
import { PermissionAction, PermissionRole, PermissionType } from "./permission";

export interface PgPermissions {
  permission: Types.ObjectId | string | PermissionType;
  actions: PermissionAction[];
}

export interface PopulatedPgPermissions {
  permissions: {
    permission: {
      _id: Types.ObjectId;
      name: string;
    };
    actions: string[];
  }[];
}

export interface PermissionGroupType {
  name: string;
  code: string;
  description?: string;
  permissions: PgPermissions[];
  realm: Realm;
  role?: PermissionRole;
  department?: Types.ObjectId;
  isSystemDefined?: boolean;
  organization?: string;
  organizationType?: string;
  enabled?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPermissionGroup extends PermissionGroupType {}
export interface PermissionGroupDocument extends IPermissionGroup, Document {}
