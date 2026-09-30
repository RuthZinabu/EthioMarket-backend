import { Router } from "express";
import cartController from "../controllers/cart.controller";

const router: Router = Router();

router.get("/health", cartController.healthCheck);

router.post("/:customerId/sync", cartController.syncCart);

router.get("/:customerId", cartController.getCart);
router.post("/:customerId/items", cartController.addToCart);
router.patch("/:customerId/items/:productId", cartController.updateItemQuantity);
router.delete("/:customerId/items/:productId", cartController.removeItem);
router.delete("/:customerId", cartController.clearCart);

export default router;
