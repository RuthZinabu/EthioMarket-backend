import mongoose from "mongoose";
import paginator from "mongoose-paginate-v2";
import UserModel from "./user.model";
import { InstitutionDocument, InstitutionType } from "../types/institution";
import { Status } from "../types/enum";

const institutionSchema = new mongoose.Schema<InstitutionDocument>(
  {
    name: { type: String, trim: true },
    institutionType: {
      type: String,
      enum: Object.values(InstitutionType),
      required: true,
    },
    phoneNumber: { type: String, trim: true, unique: true },
    email: { type: String, trim: true, lowercase: true, index: { unique: true, sparse: true } },
    etSwitchCode: { type: String },
    swiftCode: { type: String },
    logo: { type: String },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserModel.modelName,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserModel.modelName,
    },
    approvedAt: { type: Date },
    rejectedReason: { type: String },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserModel.modelName,
    },
    businessDetail: {
      tinNumber: { type: String, trim: true, index: true },
      nationalId: { type: String, trim: true },
      businessLicense: { type: String, trim: true },
      signedAgreement: { type: String, trim: true },
    },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

institutionSchema.index({ enabled: 1, isDeleted: 1 });

institutionSchema.plugin(paginator);

const InstitutionModel = mongoose.model<InstitutionDocument, mongoose.PaginateModel<InstitutionDocument>>("Institution", institutionSchema);

export default InstitutionModel;
