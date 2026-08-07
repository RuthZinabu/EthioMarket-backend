import { Document, Types } from "mongoose";
import z from "zod";
export declare enum CustomerStatus {
    ACTIVE = "ACTIVE",
    PENDING = "PENDING",
    INACTIVE = "INACTIVE",
    DORMANT = "DORMANT",
    DISABLED = "DISABLED",
    LOCKED = "LOCKED",
    SUSPENDED = "SUSPENDED",
    KYC_ENFORCED = "KYC_ENFORCED"
}
export declare enum CustomerKYCLevel {
    LEVEL_ONE = "1",
    LEVEL_TWO = "2"
}
export declare enum CustomerSex {
    Male = "Male",
    Female = "Female"
}
export declare enum CustomerEmploymentStatus {
    FULL_TIME = "full-time",
    PART_TIME = "part-time",
    SELF_EMPLOYED = "self-employed",
    UNEMPLOYED = "unemployed",
    STUDENT = "student",
    RETIRED = "retired",
    FREELANCE = "freelance",
    INTERN = "intern",
    CONTRACT = "contract",
    OTHER = "other"
}
export interface ICustomer extends Document {
    userCode: string;
    customerCode?: string;
    fullName: string;
    walletId?: string;
    clientId?: string;
    motherName?: string;
    nationality?: string;
    birthDate?: Date;
    phoneNumber: string;
    sex: CustomerSex;
    gender?: "male" | "female";
    martialStatus?: "single" | "married" | "divorced" | "widowed";
    employmentStatus?: CustomerEmploymentStatus;
    occupation?: string;
    employersName?: string;
    monthlyIncome?: string;
    email: string;
    avatar: string;
    userName?: string;
    userBio?: string;
    photo?: string;
    signature?: string;
    address: Types.ObjectId;
    country?: string;
    region?: string;
    city?: string;
    woreda?: string;
    subCity?: string;
    houseNo?: string;
    idFront?: string;
    idBack?: string;
    documentFront?: string;
    documentBack?: string;
    idNumber?: string;
    residentialStatus?: string;
    documentImage?: string;
    userImage?: string;
    realm: string;
    password?: string;
    passwordHistory: string[];
    passwordChangedAt?: Date;
    pin?: string;
    loginPIN?: string;
    firstPINSet?: boolean;
    PINHistory?: string[];
    isSetPassword: boolean;
    isSetPin: boolean;
    deviceId: string;
    deviceUUID?: string;
    deviceStatus: "LINKED" | "UNLINKED";
    deviceLinkedDate?: Date;
    devicePlatform?: "IOS" | "ANDROID";
    APPVersion?: string;
    pushToken?: string;
    APPInstallationDate?: Date;
    KYCStatus?: "PENDING" | "APPROVED" | "REJECTED";
    KYCRejectReasonField?: unknown[];
    KYCRejectReason?: string;
    KYCApproved?: boolean;
    brachApproved?: boolean;
    isVerified?: boolean;
    KYCLevel?: CustomerKYCLevel;
    KYCActionBy?: unknown[];
    BranchActionBy?: unknown[];
    kycDate?: Date;
    faydaInfo?: Record<string, unknown>;
    faydaVerified?: boolean;
    purpose?: string;
    registrationMethod: "SELF_ONBOARDING" | "AGENT";
    registeredByAgent?: Types.ObjectId;
    isSelfRegistered?: boolean;
    registerdBy?: unknown;
    referredBy?: string;
    creatorAgentCode?: string;
    agentReferralCode?: string;
    agentInfo?: Record<string, unknown>;
    dateJoined?: Date;
    mainAccount?: string;
    lastMainAccount?: string;
    accountLinked?: boolean;
    lastAccountLinked?: boolean;
    andOrCustomerNumber?: string[];
    accountType?: "NEW" | "LINKED";
    accountStatus?: "ACTIVE" | "INACTIVE";
    accountBranchType?: "CB" | "IFB";
    accountAuthorizationCode?: string;
    loanScore?: number;
    customerNumber?: string;
    virtualAccount?: boolean;
    walletBlockedUntil?: Date;
    walletBlockedReason?: string;
    loginAttemptCount: number;
    lockedOnAttemptMAX?: boolean;
    lastLoginAttempt: Date;
    nextLoginAttempt?: Date;
    lastOtpAttempt: Date;
    lastLogin: Date | null;
    lastOnlineDate?: Date;
    lastDailyReward?: Date;
    otpAttemptCount: number;
    sessionExpiresOn?: Date;
    enabled: boolean;
    isDeleted: boolean;
    isActivated: boolean;
    isAccountActive: boolean;
    isAccountBlocked?: boolean;
    unlockAccountRequested?: boolean;
    cronBlockAction?: boolean;
    isUSSDEnabled?: boolean;
    isContactPerson: boolean;
    lastSIMOwnershipChangeISOTime?: string | null;
    lastSIMReplacementISOTime?: string | null;
    lastSIMStatus?: string | null;
    lastSIMStatusChangeISOTime?: string | null;
    createdBy: Types.ObjectId;
    lastModifiedBy: Types.ObjectId;
    lastModified?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const createCustomerSchema: z.ZodObject<{
    fullName: z.ZodString;
    phone_number: z.ZodString;
    email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>;
    password: z.ZodOptional<z.ZodString>;
    pin: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateCustomerProfileSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>;
    avatar: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateCustomerType = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerProfileType = z.infer<typeof updateCustomerProfileSchema>;
//# sourceMappingURL=customer.d.ts.map