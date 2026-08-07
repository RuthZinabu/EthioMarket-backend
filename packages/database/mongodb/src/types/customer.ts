import { Document, Types } from "mongoose";
import z from "zod";

export enum CustomerStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE",
  DORMANT = "DORMANT",
  DISABLED = "DISABLED",
  LOCKED = "LOCKED",
  SUSPENDED = "SUSPENDED",
  KYC_ENFORCED = "KYC_ENFORCED",
}

export enum CustomerKYCLevel {
  LEVEL_ONE = "1",
  LEVEL_TWO = "2",
}
export enum CustomerSex {
  Male = "Male",
  Female = "Female",
}

export enum CustomerEmploymentStatus {
  FULL_TIME = "full-time",
  PART_TIME = "part-time",
  SELF_EMPLOYED = "self-employed",
  UNEMPLOYED = "unemployed",
  STUDENT = "student",
  RETIRED = "retired",
  FREELANCE = "freelance",
  INTERN = "intern",
  CONTRACT = "contract",
  OTHER = "other",
}

export interface ICustomer extends Document {
  // Identity
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

  // Contact/Profile
  email: string;
  avatar: string;
  userName?: string;
  userBio?: string;
  photo?: string;
  signature?: string;

  // Address
  address: Types.ObjectId;
  country?: string;
  region?: string;
  city?: string;
  woreda?: string;
  subCity?: string;
  houseNo?: string;

  // Documents
  idFront?: string;
  idBack?: string;
  documentFront?: string;
  documentBack?: string;
  idNumber?: string;
  residentialStatus?: string;
  documentImage?: string;
  userImage?: string;

  // Auth & Security
  realm: string; // Typically "Member"
  password?: string;
  passwordHistory: string[];
  passwordChangedAt?: Date;
  pin?: string;
  loginPIN?: string;
  firstPINSet?: boolean;
  PINHistory?: string[];
  isSetPassword: boolean;
  isSetPin: boolean;

  // Device Info
  deviceId: string;
  deviceUUID?: string;
  deviceStatus: "LINKED" | "UNLINKED";
  deviceLinkedDate?: Date;
  devicePlatform?: "IOS" | "ANDROID";
  APPVersion?: string;
  pushToken?: string;
  APPInstallationDate?: Date;

  // KYC Info
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

  // Registration & referral
  registrationMethod: "SELF_ONBOARDING" | "AGENT";
  registeredByAgent?: Types.ObjectId;
  isSelfRegistered?: boolean;
  registerdBy?: unknown;
  referredBy?: string;
  creatorAgentCode?: string;
  agentReferralCode?: string;
  agentInfo?: Record<string, unknown>;
  dateJoined?: Date;

  // Account & Wallet
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

  // Security & Login Stats
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

  // Lifecycle & Status Flags
  enabled: boolean;
  isDeleted: boolean;
  isActivated: boolean;
  isAccountActive: boolean;
  isAccountBlocked?: boolean;
  unlockAccountRequested?: boolean;
  cronBlockAction?: boolean;
  isUSSDEnabled?: boolean;
  isContactPerson: boolean;

  // SIM Info
  lastSIMOwnershipChangeISOTime?: string | null;
  lastSIMReplacementISOTime?: string | null;
  lastSIMStatus?: string | null;
  lastSIMStatusChangeISOTime?: string | null;

  // Audit
  createdBy: Types.ObjectId;
  lastModifiedBy: Types.ObjectId;
  lastModified?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const createCustomerSchema = z.object({
  fullName: z.string().min(2, "Full name is required").trim(),
  phone_number: z
    .string()
    .startsWith("+251", { message: "Invalid phone number" })
    .length(13, { message: "Phone number must be 13 characters including +" }),
  email: z.union([z.string().email({ message: "Invalid email" }), z.literal("")]).optional(),
  password: z.string().min(6).optional(),
  pin: z.string().length(4).optional(),
});

export const updateCustomerProfileSchema = z.object({
  fullName: z.string().min(2, "Full name is required").trim().optional(),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  avatar: z.string().optional(),
});

export type CreateCustomerType = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerProfileType = z.infer<typeof updateCustomerProfileSchema>;
