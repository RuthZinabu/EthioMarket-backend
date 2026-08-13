import mongoose, { Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import { CustomerDocument, CustomerStatus, CustomerSex } from "../types/customer";

const AddressSchema = new Schema(
  {
    label: { type: String, default: "Home" },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true, default: "ET" },
    zipCode: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const customerSchema = new Schema<CustomerDocument>(
  {
    customerCode: { type: String },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, index: { unique: true, sparse: true } },
    phoneNumber: { type: String, required: true, index: true },
    avatar: { type: String },
    sex: { type: String, enum: Object.values(CustomerSex) },
    birthDate: { type: Date },
    nationality: { type: String },
    addresses: [AddressSchema],
    preferredCurrency: { type: String, default: "USD" },
    realm: { type: String, default: "Customer" },
    password: { type: String },
    passwordHistory: { type: [String], default: [] },
    passwordChangedAt: { type: Date },
    isSetPassword: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    deviceId: { type: String },
    pushToken: { type: String },
    status: {
      type: String,
      enum: Object.values(CustomerStatus),
      default: CustomerStatus.ACTIVE,
      required: true,
    },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    loginAttemptCount: { type: Number, default: 0 },
    lastLoginAttempt: { type: Date },
    lastLogin: { type: Date, default: null },
    lastModifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

customerSchema.plugin(paginator);

const CustomerModel = mongoose.model<CustomerDocument, mongoose.PaginateModel<CustomerDocument>>("Customer", customerSchema);

export default CustomerModel;
