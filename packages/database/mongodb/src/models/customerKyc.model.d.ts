import mongoose from "mongoose";
import { CustomerKYC } from "../types/customer-kyc";
declare const CustomerKYCModel: mongoose.Model<CustomerKYC, {}, {}, {}, mongoose.Document<unknown, {}, CustomerKYC, {}, mongoose.DefaultSchemaOptions> & CustomerKYC & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, CustomerKYC>;
export default CustomerKYCModel;
//# sourceMappingURL=customerKyc.model.d.ts.map