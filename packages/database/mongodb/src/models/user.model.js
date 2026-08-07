"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_1 = require("../types/user");
const enum_1 = require("../types/enum");
const permission_1 = require("../types/permission");
const userSchema = new mongoose_1.Schema({
    userCode: { type: String, required: true },
    firstName: { type: String, lowercase: true, trim: true },
    lastName: { type: String, lowercase: true, trim: true },
    middleName: { type: String, lowercase: true, trim: true },
    email: { type: String, trim: true, lowercase: true, index: { unique: true, sparse: true } },
    ussdPin: { type: String },
    ussdEnabled: { type: Boolean, default: false },
    avatar: { type: String },
    phoneNumber: { type: String },
    customerCode: { type: String },
    address: { type: mongoose_1.Schema.Types.ObjectId, ref: "Address" },
    organization: { type: mongoose_1.Schema.Types.ObjectId, refPath: "organizationEnum" },
    organizationEnum: { type: String, enum: ["Institution", "Agent"] },
    realm: { type: String, enum: enum_1.Realm },
    role: { type: String, enum: user_1.UserRole },
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
    department: { type: mongoose_1.Schema.Types.ObjectId, ref: "Department" },
    permissionGroup: { type: mongoose_1.Schema.Types.ObjectId, ref: "PermissionGroup" },
    additionalPermissions: [
        {
            permission: { type: mongoose_1.Schema.Types.ObjectId, ref: "Permission", required: true },
            actions: [{ type: String, enum: Object.values(permission_1.PermissionAction), required: true }],
        },
    ],
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    lastModifiedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
userSchema.index({ phoneNumber: 1, email: 1, realm: 1, role: 1, organization: 1 });
userSchema.index({ customerCode: 1 });
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map