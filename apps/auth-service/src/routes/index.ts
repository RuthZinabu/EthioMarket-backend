import { type Express } from "express";
import authRoute from "./auth.route";
import { routePrefix } from "@emacare/shared-utils";

export default function router(app: Express): void {
  app.use(`${routePrefix}/auth`, authRoute);
  app.use("/", authRoute);
}
