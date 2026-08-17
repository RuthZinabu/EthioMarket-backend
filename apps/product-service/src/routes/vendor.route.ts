import { Router } from "express";
import multer from "multer";
import vendorController from "../controllers/vendor.controller";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const vendorUploadFields = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
  { name: "businessLicense", maxCount: 1 },
]);

const router = Router();

router.get("/paginate", vendorController.getAllVendors);

router.post("/create", vendorUploadFields, vendorController.createVendor);

router.post("/upload", upload.single("file"), vendorController.uploadVendorAsset);

router.get("/get/:id", vendorController.getVendorById);

router.patch("/update/:id", vendorUploadFields, vendorController.updateVendor);

router.patch("/approve/:id", vendorController.approveVendor);

router.delete("/delete/:id", vendorController.deleteVendor);

export default router;
