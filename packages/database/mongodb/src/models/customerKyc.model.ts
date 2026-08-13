import mongoose, { Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import { CustomerKYCDocument } from "../types/customer-kyc";
import { KYCPurpose, Status } from "../types/enum";

const CustomerKYCSchema = new Schema<CustomerKYCDocument>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    clientId: { type: String },
    photo: {
      downloadLink: { type: String },
      contentType: { type: String },
      size: { type: String },
      uploadedAt: { type: Date },
    },
    purpose: {
      type: String,
      enum: Object.values(KYCPurpose),
      default: KYCPurpose.WALLET_OPENING,
      required: true,
    },
    rejectionReasons: { type: [String], default: [] },
    faydaInfo: { type: Schema.Types.Mixed },
    faydaVerified: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
      required: true,
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectedReason: { type: String },
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

CustomerKYCSchema.plugin(paginator);

const CustomerKYCModel = mongoose.model<CustomerKYCDocument, mongoose.PaginateModel<CustomerKYCDocument>>("CustomerKYC", CustomerKYCSchema);

export default CustomerKYCModel;
