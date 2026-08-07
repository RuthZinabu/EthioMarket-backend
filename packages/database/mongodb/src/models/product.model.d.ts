import mongoose from "mongoose";
import { ProductDocument } from '../types/product';
declare const productModel: mongoose.Model<ProductDocument, {}, {}, {}, mongoose.Document<unknown, {}, ProductDocument, {}, mongoose.DefaultSchemaOptions> & ProductDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ProductDocument>;
export default productModel;
//# sourceMappingURL=product.model.d.ts.map