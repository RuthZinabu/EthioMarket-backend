import mongoose, { Schema } from "mongoose";
import { CustomerKYC } from "../types/customer-kyc";

const CustomerKYCSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
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
    faydaInfo: { type: Schema.Types.Mixed },
    faydaVerified: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

CustomerKYCSchema.index(
  { "faydaInfo.sub": 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: {
      enabled: true,
      isDeleted: false,
      "faydaInfo.sub": { $exists: true },
    },
    name: "unique_active_fayda_sub",
  },
);

// Create model
const CustomerKYCModel =
  (mongoose.models.CustomerKYC as mongoose.Model<CustomerKYC>) ||
  mongoose.model<CustomerKYC>("CustomerKYC", CustomerKYCSchema);

export default CustomerKYCModel;
