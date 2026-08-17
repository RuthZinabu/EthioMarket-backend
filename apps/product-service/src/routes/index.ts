import { type Express } from "express";
import productRoute from "./product.route";
import vendorRoute from "./vendor.route";
import { routePrefix } from "@emacare/shared-utils";

export default function router(app: Express): void {
  app.use(`${routePrefix}/products`, productRoute);
  app.use(`${routePrefix}/vendors`, vendorRoute);
}