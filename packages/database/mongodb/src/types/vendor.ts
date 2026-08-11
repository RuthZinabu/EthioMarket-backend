import { Document, Types } from "mongoose";

export enum VendorStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export enum PayoutMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  STRIPE_EXPRESS = "STRIPE_EXPRESS",
  PAYPAL = "PAYPAL",
}

export interface IVendorPayoutBankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  swiftOrRoutingCode?: string;
  currency: string;
}

export interface IVendorBusinessDetail {
  tinNumber?: string;
  businessLicense?: string;
  taxId?: string;
}

export interface IVendor extends Document {
  storeName: string;
  slug: string;
  description?: string;
  logo?: string;
  bannerImage?: string;
  contactEmail: string;
  contactPhone: string;
  country: string;
  address?: string;
  status: VendorStatus;
  isVerified: boolean;
  commissionRate: number;
  payoutMethod: PayoutMethod;
  payoutBankDetails?: IVendorPayoutBankDetails;
  businessDetail?: IVendorBusinessDetail;
  rating?: number;
  numReviews?: number;
  ownerId?: Types.ObjectId;
  enabled: boolean;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  lastModifiedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
