import mongoose, { Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import { OtpDocument, OTPFor } from "../types/otp";
import { Status } from "../types/enum";

const OtpSchema = new Schema<OtpDocument>(
  {
    code: { type: String, required: true },
    username: { type: String, required: true, index: true },
    expiredAt: { type: Date, required: true },
    otpFor: { type: String, enum: Object.values(OTPFor), required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
      required: true,
    },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

OtpSchema.plugin(paginator);

const OtpModel = mongoose.model<OtpDocument, mongoose.PaginateModel<OtpDocument>>("Otp", OtpSchema);

export default OtpModel;
