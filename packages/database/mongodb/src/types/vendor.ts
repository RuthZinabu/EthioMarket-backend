import { Document, Types } from "mongoose";
import { PayoutMethod, VendorStatus } from "./enum";
export { PayoutMethod, VendorStatus };

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

export interface IVendor {
  storeName: string;
  ownerName?: string;
  slug?: string;
  description?: string;
  logo?: string;
  bannerImage?: string;
  contactEmail?: string;
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
  enabled: boolean;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectedReason?: string;
  lastModifiedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VendorDocument extends IVendor, Document {}
