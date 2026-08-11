import { Document, Types } from "mongoose";
import { PgPermissions } from "./permission-group";
import { Realm } from "./enum";
export { Realm };

export enum UserRole {
  SuperAdmin = "SuperAdmin",
  Admin = "Admin",
  VendorOwner = "VendorOwner",
  VendorStaff = "VendorStaff",
  Maker = "Maker",
  Checker = "Checker",
  FullAuthorizer = "FullAuthorizer",
  Customer = "Customer",
}

export interface IUser extends Document {
  userCode: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phoneNumber: string;
  email: string;
  avatar?: string;
  address?: Types.ObjectId;
  organization?: Types.ObjectId;
  vendorId?: Types.ObjectId;
  department?: Types.ObjectId;
  realm: Realm;
  role: UserRole;
  password?: string;
  passwordHistory?: string[];
  passwordChangedAt?: Date;
  isSetPassword: boolean;
  loginAttemptCount: number;
  lastLoginAttempt?: Date;
  nextLoginAttempt?: Date | null;
  lastOtpAttempt?: Date;
  nextOtpAttempt?: Date | null;
  lastLogin: Date | null;
  otpAttemptCount: number;
  enabled: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  permissionGroup?: Types.ObjectId;
  additionalPermissions?: PgPermissions[];
  createdBy?: Types.ObjectId;
  lastModifiedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
