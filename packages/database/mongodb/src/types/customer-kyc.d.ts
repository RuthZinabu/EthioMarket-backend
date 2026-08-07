import mongoose, { Types } from "mongoose";
export interface CustomerKYC extends mongoose.Document {
    customerId: Types.ObjectId;
    clientId: string;
    KYCStatus: "APPROVED" | "REJECTED" | "PENDING";
    clientType: string;
    photo: {
        downloadLink: string;
        contentType: string;
        size: string;
        uploadedAt: Date;
    };
    purpose: "wallet_opening" | "level_upgrade";
    rejectionReasons: string[];
    faydaInfo: Object;
    faydaVerified: boolean;
    enabled: boolean;
    isDeleted: boolean;
}
//# sourceMappingURL=customer-kyc.d.ts.map