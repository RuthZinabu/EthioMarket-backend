import type { Express } from "express";
import { Router } from "express";

import productController from "../controllers/product.controller";

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

// update inventory (kept for backward compatibility)
router.patch("/:id/inventory", productController.updateInventory);

// full/partial update product fields
router.patch("/:id", productController.updateProduct);

// delete
router.delete("/:id", productController.deleteProduct);

export default router;


