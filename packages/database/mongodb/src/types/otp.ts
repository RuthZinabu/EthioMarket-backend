import { Document } from "mongoose";
import { Status } from "./enum";

export enum OTPFor {
  Forgot_Password = "Forgot_Password",
  Pre_Login = "Pre_Login",
  INITIATE_TRANSACTION = "INITIATE_TRANSACTION",
  VERIFY_TRANSACTION = "VERIFY_TRANSACTION",
  VERIFY_WITHDRAWAL = "VERIFY_WITHDRAWAL",
}

export interface IOtp {
  code: string;
  username: string;
  expiredAt: Date;
  otpFor: OTPFor;
  status: Status | string;
  enabled?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OtpDocument extends IOtp, Document {}
