import type { Express } from "express";
import { Router } from "express";

import productController from "../conrtollers/product.controller";


  const router = Router();

  // Health
  router.get("/health", productController.healthCheck);

  // CRUD
  // list with optional filters
  router.get("/", productController.getAllProducts);
  // get by id
  router.get("/:id", productController.getProductById);
  // create
  router.post("/", productController.createProduct);
  // update inventory (partial)
  router.patch("/:id/inventory", productController.updateInventory);

export default router;

