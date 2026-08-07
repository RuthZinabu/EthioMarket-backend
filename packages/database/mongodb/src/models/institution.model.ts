import mongoose from "mongoose";
import UserModel from "./user.model";
import { IInstitution, InstitutionType } from "../types/institution";

const institutionSchema = new mongoose.Schema<IInstitution>(
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserModel.modelName,
    },
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
const InstitutionModel = mongoose.model<IInstitution>("Institution", institutionSchema);

export default InstitutionModel;
