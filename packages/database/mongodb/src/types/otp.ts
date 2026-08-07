import { Document } from "mongoose";

export enum OTPFor {
  Forgot_Password = "Forgot_Password",
  Pre_Login = "Pre_Login",
  INITIATE_TRANSACTION = "INITIATE_TRANSACTION",
  VERIFY_TRANSACTION = "VERIFY_TRANSACTION",
  VERIFY_WITHDRAWAL = "VERIFY_WITHDRAWAL",
}

export interface IOtp extends Document {
  code: string;
  username: string;
  expiredAt: Date;
  otpFor: OTPFor;
}
