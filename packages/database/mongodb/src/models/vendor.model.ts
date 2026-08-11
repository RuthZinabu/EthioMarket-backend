import mongoose, { Schema } from "mongoose";
import { IVendor, VendorStatus, PayoutMethod } from "../types/vendor";

const VendorSchema = new Schema<IVendor>(
  {
    storeName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    logo: { type: String },
    bannerImage: { type: String },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    country: { type: String, required: true, default: "ET" },
    address: { type: String },
    status: {
      type: String,
      enum: Object.values(VendorStatus),
      default: VendorStatus.PENDING,
    },
    isVerified: { type: Boolean, default: false },
    commissionRate: { type: Number, default: 0.10 },
    payoutMethod: {
      type: String,
      enum: Object.values(PayoutMethod),
      default: PayoutMethod.BANK_TRANSFER,
    },
    payoutBankDetails: {
      accountName: { type: String },
      accountNumber: { type: String },
      bankName: { type: String },
      swiftOrRoutingCode: { type: String },
      currency: { type: String, default: "USD" },
    },
    businessDetail: {
      tinNumber: { type: String },
      businessLicense: { type: String },
      taxId: { type: String },
    },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    lastModifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

VendorSchema.index({ slug: 1 });
VendorSchema.index({ status: 1, isDeleted: 1 });

const VendorModel =
  (mongoose.models.Vendor as mongoose.Model<IVendor>) ||
  mongoose.model<IVendor>("Vendor", VendorSchema);

export default VendorModel;
