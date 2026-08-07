import mongoose from "mongoose";
import { IPermissionGroup } from "../types/permission-group";
export declare const PermissionGroup: mongoose.Model<IPermissionGroup, {}, {}, {}, mongoose.Document<unknown, {}, IPermissionGroup, {}, mongoose.DefaultSchemaOptions> & IPermissionGroup & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPermissionGroup>;
export default PermissionGroup;
//# sourceMappingURL=permission-group.model.d.ts.map