import { Document, Types } from "mongoose";
import { PgPermissions } from "./permission-group";
import { Realm, UserRole } from "./enum";
export interface IUser {
  userCode: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phoneNumber: string;
  email: string;
  avatar?: string;
  address?: string;
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
  status: string;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectedReason?: string;
  createdBy?: Types.ObjectId;
  lastModifiedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends IUser, Document {}
