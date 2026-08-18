import type { Express } from "express";
import { Router } from "express";

import productController from "../controllers/product.controller";

const router = Router();

router.get("/health", productController.healthCheck);

router.get("/paginate", productController.getAllProducts);

router.get("/get/:id", productController.getProductById);

router.post("/create", productController.createProduct);

router.patch("/:id/inventory", productController.updateInventory);

router.patch("/update/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

export default router;


