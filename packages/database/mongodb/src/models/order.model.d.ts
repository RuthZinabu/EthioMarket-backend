import mongoose from "mongoose";
import { OrderDocument } from "../types/order";
declare const OrderModel: mongoose.Model<OrderDocument, {}, {}, {}, mongoose.Document<unknown, {}, OrderDocument, {}, mongoose.DefaultSchemaOptions> & OrderDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, OrderDocument>;
export default OrderModel;
//# sourceMappingURL=order.model.d.ts.map