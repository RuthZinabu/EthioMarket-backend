import { Router } from "express";
import cartController from "../controllers/cart.controller";

const router: Router = Router();

router.get("/health", cartController.healthCheck);
router.get("/:userId", cartController.getCart);
router.post("/:userId/items", cartController.addToCart);
router.patch("/:userId/items/:productId", cartController.updateItemQuantity);
router.delete("/:userId/items/:productId", cartController.removeItem);
router.delete("/:userId", cartController.clearCart);

export default router;
