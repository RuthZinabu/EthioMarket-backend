import mongoose, { Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import { VendorPayoutDocument } from "../types/vendor-payout";
import { Currency, PayoutMethod, PayoutStatus, VendorStatus } from "../types/enum";

const VendorPayoutSchema = new Schema<VendorPayoutDocument>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
    payoutReference: { type: String, required: true, unique: true, index: true },
    grossAmount: { type: Number, required: true },
    commissionFee: { type: Number, required: true, default: 0 },
    netAmount: { type: Number, required: true },
    currency: { 
      type: String, 
      enum: Object.values(Currency),
      default: Currency.ETB,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(VendorStatus),
      default: PayoutStatus.PENDING,
      required: true,
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
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectedReason: { type: String },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

VendorPayoutSchema.plugin(paginator);

const VendorPayoutModel = mongoose.model<VendorPayoutDocument, mongoose.PaginateModel<VendorPayoutDocument>>("VendorPayout", VendorPayoutSchema);

export default VendorPayoutModel;
