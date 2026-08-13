import { Document, Types } from "mongoose";
import { Status } from "./enum";

export enum InstitutionType {
  VENDER = "vender",
  DEFAULT = "default",
}

export interface IInstitutionBusinessDetail {
  tinNumber?: string;
  nationalId?: string;
  businessLicense?: string;
  signedAgreement?: string;
}

export interface IInstitution {
  name: string;
  institutionType: InstitutionType;
  phoneNumber: string;
  email: string;
  etSwitchCode?: string;
  swiftCode: string;
  logo: string;
  status: Status | string;
  enabled: boolean;
  isDeleted: boolean;
  createdBy: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectedReason?: string;
  lastModifiedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  businessDetail?: IInstitutionBusinessDetail;
}

export interface InstitutionDocument extends IInstitution, Document {}
