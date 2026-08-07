import mongoose from "mongoose";
import { IInstitution } from "../types/institution";
declare const InstitutionModel: mongoose.Model<IInstitution, {}, {}, {}, mongoose.Document<unknown, {}, IInstitution, {}, mongoose.DefaultSchemaOptions> & IInstitution & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IInstitution>;
export default InstitutionModel;
//# sourceMappingURL=institution.model.d.ts.map