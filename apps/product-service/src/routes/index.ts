import { type Express } from "express";
import productRoute from "./product.route";
import { routePrefix } from "@emacare/shared-utils";

export default function initRoutes(app: Express): void {
  app.use(`${routePrefix}/products`, productRoute);
}