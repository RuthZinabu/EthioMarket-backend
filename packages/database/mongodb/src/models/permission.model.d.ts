import mongoose from "mongoose";
import { IPermission } from "../types/permission";
export declare const Permission: mongoose.Model<IPermission, {}, {}, {}, mongoose.Document<unknown, {}, IPermission, {}, mongoose.DefaultSchemaOptions> & IPermission & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPermission>;
export default Permission;
//# sourceMappingURL=permission.model.d.ts.map