import type { Express } from "express";
import { Router } from "express";
import multer from "multer";

import productController from "../controllers/product.controller";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const productUploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

const router = Router();

router.get("/health-check", productController.healthCheck);

router.get("/paginate", productController.getAllProducts);

router.get("/get/:id", productController.getProductById);

router.post("/create", productUploadFields, productController.createProduct);

router.post("/upload", upload.single("file"), productController.uploadProductAsset);

router.patch("/update-inventory/:id", productController.updateInventory);

router.patch("/updateStatus/:id", productController.approveProduct);

router.put("/update/:id", productUploadFields, productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

export default router;


