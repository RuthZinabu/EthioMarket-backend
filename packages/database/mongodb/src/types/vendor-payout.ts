import { Document, Types } from "mongoose";
import { IVendorPayoutBankDetails } from "./vendor";
import { Currency, PayoutMethod, PayoutStatus, VendorStatus } from "./enum";
export { PayoutStatus };

export interface IVendorPayout {
  vendorId: Types.ObjectId;
  payoutReference: string;
  grossAmount: number;
  commissionFee: number;
  netAmount: number;
  currency: Currency;
  status: VendorStatus;
  payoutMethod: PayoutMethod;
  bankDetails?: IVendorPayoutBankDetails;
  periodStart?: Date;
  periodEnd?: Date;
  processedAt?: Date;
  transactionReference?: string;
  notes?: string;
  createdBy?: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectedReason?: string;
  enabled?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VendorPayoutDocument extends IVendorPayout, Document {}
