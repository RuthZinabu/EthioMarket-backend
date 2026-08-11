import mongoose, { Schema } from "mongoose";
import { IPermission, PermissionModule } from "../types/permission";
import { Realm } from "../types/enum";

const PermissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: true,
      enum: Object.values(PermissionModule),
    },
    description: { type: String },
    realm: { type: String, enum: Object.values(Realm), required: true },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Permission =
  (mongoose.models.Permission as mongoose.Model<IPermission>) ||
  mongoose.model<IPermission>("Permission", PermissionSchema);
export default Permission;
