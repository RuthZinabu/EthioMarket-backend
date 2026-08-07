import mongoose from "mongoose";
import { CartDocument } from "../types/cart";
declare const CartModel: mongoose.Model<CartDocument, {}, {}, {}, mongoose.Document<unknown, {}, CartDocument, {}, mongoose.DefaultSchemaOptions> & CartDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, CartDocument>;
export default CartModel;
//# sourceMappingURL=cart.model.d.ts.map