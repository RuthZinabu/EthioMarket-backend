"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const CustomerKYCSchema = new mongoose_1.Schema({
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Customer", required: true },
    clientId: { type: String },
    clientType: { type: String },
    KYCStatus: { type: String, enum: ["APPROVED", "REJECTED"], default: "PENDING" },
    photo: {
        downloadLink: { type: String },
        contentType: { type: String },
        size: { type: String },
        uploadedAt: { type: Date },
    },
    purpose: { type: String, enum: ["wallet_opening", "level_upgrade"], required: false },
    rejectionReasons: { type: [String], default: [] },
    faydaInfo: { type: mongoose_1.Schema.Types.Mixed },
    faydaVerified: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
CustomerKYCSchema.index({ "faydaInfo.sub": 1 }, {
    unique: true,
    sparse: true,
    partialFilterExpression: {
        enabled: true,
        isDeleted: false,
        "faydaInfo.sub": { $exists: true },
    },
    name: "unique_active_fayda_sub",
});
// Create model
const CustomerKYCModel = mongoose_1.default.model("CustomerKYC", CustomerKYCSchema);
exports.default = CustomerKYCModel;
//# sourceMappingURL=customerKyc.model.js.map