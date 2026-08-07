import { Document, Types } from "mongoose";
export declare enum InstitutionType {
    VENDER = "vender",
    DEFAULT = "default"
}
export interface IInstitutionBusinessDetail {
    tinNumber?: string;
    nationalId?: string;
    businessLicense?: string;
    signedAgreement?: string;
}
export interface IInstitution extends Document {
    name: string;
    institutionType: InstitutionType;
    phoneNumber: string;
    email: string;
    etSwitchCode?: string;
    swiftCode: string;
    logo: string;
    enabled: boolean;
    isDeleted: boolean;
    createdBy: Types.ObjectId;
    lastModifiedBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    businessDetail?: IInstitutionBusinessDetail;
}
//# sourceMappingURL=institution.d.ts.map