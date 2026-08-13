import mongoose, { Document, Types } from "mongoose";
import { KYCPurpose } from "./enum";

export interface CustomerKYC {
  customerId: Types.ObjectId;
  clientId: string;
  photo: {
    downloadLink: string;
    contentType: string;
    size: string;
    uploadedAt: Date;
  };
  purpose: KYCPurpose;
  rejectionReasons: string[];
  faydaInfo: Object;
  faydaVerified: boolean;
  enabled: boolean;
  isDeleted: boolean;
  status: string;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectedReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerKYCDocument extends CustomerKYC, Document {}
export interface CustomerKycDocument extends CustomerKYC, Document {}
