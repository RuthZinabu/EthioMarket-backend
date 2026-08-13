import mongoose, { Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import { VendorDocument } from "../types/vendor";
import { Currency, PayoutMethod, VendorStatus } from "../types/enum";

const VendorSchema = new Schema<VendorDocument>(
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
      required: true,
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
      currency: { 
        type: String, 
        enum: Object.values(Currency), 
        default: Currency.ETB
      },
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
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectedReason: { type: String },
    lastModifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

VendorSchema.index({ slug: 1 });
VendorSchema.index({ status: 1, isDeleted: 1 });

VendorSchema.plugin(paginator);

const VendorModel = mongoose.model<VendorDocument, mongoose.PaginateModel<VendorDocument>>("Vendor", VendorSchema);

export default VendorModel;
