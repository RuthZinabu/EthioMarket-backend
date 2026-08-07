import mongoose from "mongoose";
import { ICustomer } from "../types/customer";
declare const CustomerModel: mongoose.Model<ICustomer, {}, {}, {}, mongoose.Document<unknown, {}, ICustomer, {}, mongoose.DefaultSchemaOptions> & ICustomer & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICustomer>;
export default CustomerModel;
//# sourceMappingURL=customer.model.d.ts.map