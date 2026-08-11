import mongoose, { model, Schema } from "mongoose";
import { IUser, UserRole } from "../types/user";
import { Realm } from "../types/enum";
import { PermissionAction } from "../types/permission";

const userSchema = new Schema<IUser>(
  {
    userCode: { type: String, required: true },
    firstName: { type: String, lowercase: true, trim: true },
    lastName: { type: String, lowercase: true, trim: true },
    middleName: { type: String, lowercase: true, trim: true },
    email: { type: String, trim: true, lowercase: true, index: { unique: true, sparse: true } },
    avatar: { type: String },
    phoneNumber: { type: String },
    address: { type: Schema.Types.ObjectId, ref: "Address" },
    organization: { type: Schema.Types.ObjectId, ref: "Vendor" },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", index: true },
    realm: { type: String, enum: Realm },
    role: { type: String, enum: Object.values(UserRole) },
    password: { type: String },
    passwordHistory: { type: [String], default: [] },
    passwordChangedAt: { type: Date },
    isSetPassword: { type: Boolean, default: false },
    loginAttemptCount: { type: Number, default: 0 },
    otpAttemptCount: { type: Number, default: 0 },
    lastLoginAttempt: { type: Date },
    nextLoginAttempt: { type: Date, default: null },
    lastOtpAttempt: { type: Date },
    nextOtpAttempt: { type: Date, default: null },
    lastLogin: { type: Date, default: null },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    permissionGroup: { type: Schema.Types.ObjectId, ref: "PermissionGroup" },
    additionalPermissions: [
      {
        permission: { type: Schema.Types.ObjectId, ref: "Permission", required: true },
        actions: [{ type: String, enum: Object.values(PermissionAction), required: true }],
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    lastModifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

userSchema.index({ phoneNumber: 1, email: 1, realm: 1, role: 1, vendorId: 1 });

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  model<IUser>("User", userSchema);

export default UserModel;
