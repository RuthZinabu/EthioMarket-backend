import mongoose, { Schema } from "mongoose";
import { IVendorPayout, PayoutStatus } from "../types/vendor-payout";
import { PayoutMethod } from "../types/vendor";

const VendorPayoutSchema = new Schema<IVendorPayout>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
    payoutReference: { type: String, required: true, unique: true, index: true },
    grossAmount: { type: Number, required: true },
    commissionFee: { type: Number, required: true, default: 0 },
    netAmount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: Object.values(PayoutStatus),
      default: PayoutStatus.PENDING,
      index: true,
    },
    payoutMethod: {
      type: String,
      enum: Object.values(PayoutMethod),
      default: PayoutMethod.BANK_TRANSFER,
    },
    bankDetails: {
      accountName: { type: String },
      accountNumber: { type: String },
      bankName: { type: String },
      swiftOrRoutingCode: { type: String },
      currency: { type: String },
    },
    periodStart: { type: Date },
    periodEnd: { type: Date },
    processedAt: { type: Date },
    transactionReference: { type: String },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const VendorPayoutModel =
  (mongoose.models.VendorPayout as mongoose.Model<IVendorPayout>) ||
  mongoose.model<IVendorPayout>("VendorPayout", VendorPayoutSchema);

export default VendorPayoutModel;
