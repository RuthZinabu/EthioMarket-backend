import mongoose, { Schema } from "mongoose";
import { PaymentDocument } from "../types/payment";

const PaymentSchema = new Schema<PaymentDocument>(
  {
    orderId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    transactionId: { type: String, unique: true, sparse: true },
    cardLast4: { type: String },
  },
  { timestamps: true }
);

const PaymentModel =
  (mongoose.models.Payment as mongoose.Model<PaymentDocument>) ||
  mongoose.model<PaymentDocument>("Payment", PaymentSchema);
export default PaymentModel;
