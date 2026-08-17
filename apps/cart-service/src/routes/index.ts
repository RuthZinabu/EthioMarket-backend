import { type Express } from "express";
import cartRoutes from "./cart.routes";
import { routePrefix } from "@emacare/shared-utils";

export default function router(app: Express): void {
  app.use(`${routePrefix}/cart`, cartRoutes);
  app.use("/", cartRoutes);
}
export { cartRoutes };
