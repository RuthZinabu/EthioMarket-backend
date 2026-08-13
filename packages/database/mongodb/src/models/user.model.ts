import mongoose, { Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import { UserDocument } from "../types/user";
import { Realm, Status, UserRole } from "../types/enum";
import { PermissionAction } from "../types/permission";

const userSchema = new Schema<UserDocument>(
  {
    userCode: { type: String, required: true },
    firstName: { type: String, lowercase: true, trim: true },
    lastName: { type: String, lowercase: true, trim: true },
    middleName: { type: String, lowercase: true, trim: true },
    email: { type: String, trim: true, lowercase: true, index: { unique: true, sparse: true } },
    avatar: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    organization: { type: Schema.Types.ObjectId, ref: "Institution" },
    realm: { type: String, enum: Object.values(Realm), index: true },
    role: { type: String, enum: Object.values(UserRole), index: true },
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
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectedReason: { type: String },
    lastModifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

userSchema.index({ phoneNumber: 1, email: 1, realm: 1, role: 1, organization: 1 });
userSchema.index({ userCode: 1 });

userSchema.plugin(paginator);

const UserModel = mongoose.model<UserDocument, mongoose.PaginateModel<UserDocument>>("User", userSchema);

export default UserModel;
