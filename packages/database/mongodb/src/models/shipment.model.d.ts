import mongoose from "mongoose";
import { ShipmentDocument } from "../types/shipment";
declare const ShipmentModel: mongoose.Model<ShipmentDocument, {}, {}, {}, mongoose.Document<unknown, {}, ShipmentDocument, {}, mongoose.DefaultSchemaOptions> & ShipmentDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ShipmentDocument>;
export default ShipmentModel;
//# sourceMappingURL=shipment.model.d.ts.map