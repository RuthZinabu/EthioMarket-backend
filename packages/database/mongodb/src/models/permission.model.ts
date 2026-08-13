import mongoose, { Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import { PermissionDocument, PermissionModule } from "../types/permission";
import { Realm } from "../types/enum";

const PermissionSchema = new Schema<PermissionDocument>(
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

PermissionSchema.plugin(paginator);

export const Permission = mongoose.model<PermissionDocument, mongoose.PaginateModel<PermissionDocument>>("Permission", PermissionSchema);

export default Permission;
