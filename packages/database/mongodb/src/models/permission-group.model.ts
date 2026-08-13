import mongoose, { Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import { PermissionGroupDocument } from "../types/permission-group";
import { Realm } from "../types/enum";
import { PermissionAction, PermissionRole } from "../types/permission";

const PermissionGroupSchema = new Schema<PermissionGroupDocument>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true },
    description: { type: String },
    permissions: [
      {
        permission: { type: Schema.Types.ObjectId, ref: "Permission", required: true },
        actions: [{ type: String, enum: Object.values(PermissionAction), required: true }],
      },
    ],
    realm: { type: String, enum: Object.values(Realm), required: true },
    role: { type: String, enum: Object.values(PermissionRole) },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    isSystemDefined: { type: Boolean, default: false },
    organization: { type: String },
    organizationType: { type: String },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

PermissionGroupSchema.plugin(paginator);

export const PermissionGroup = mongoose.model<PermissionGroupDocument, mongoose.PaginateModel<PermissionGroupDocument>>("PermissionGroup", PermissionGroupSchema);

export default PermissionGroup;
