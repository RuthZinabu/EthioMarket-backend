import mongoose from "mongoose";
import { PaymentDocument } from "../types/payment";
declare const PaymentModel: mongoose.Model<PaymentDocument, {}, {}, {}, mongoose.Document<unknown, {}, PaymentDocument, {}, mongoose.DefaultSchemaOptions> & PaymentDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, PaymentDocument>;
export default PaymentModel;
//# sourceMappingURL=payment.model.d.ts.map