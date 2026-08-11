import { Document, Types } from "mongoose";
import { PayoutMethod, IVendorPayoutBankDetails } from "./vendor";

export enum PayoutStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export interface IVendorPayout extends Document {
  vendorId: Types.ObjectId;
  payoutReference: string;
  grossAmount: number;
  commissionFee: number;
  netAmount: number;
  currency: string;
  status: PayoutStatus;
  payoutMethod: PayoutMethod;
  bankDetails?: IVendorPayoutBankDetails;
  periodStart?: Date;
  periodEnd?: Date;
  processedAt?: Date;
  transactionReference?: string;
  notes?: string;
  createdBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
