import express from "express";
import dotenv from "dotenv";
import { logger } from "@emacare/shared-utils";

import initRoutes from "./routes/index";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());


initRoutes(app);

app.listen(PORT, () => {
  logger.info(`📦 Product Service running on http://localhost:${PORT}`);
});


export default app;
