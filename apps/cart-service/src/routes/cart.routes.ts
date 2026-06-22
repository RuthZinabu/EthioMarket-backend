import { Router } from "express";
import cartController from "../controllers/cart.controller";

const router: Router = Router();

// CRUD
router.get('/health-check', cartController.healthCheck);

router.get('/:userId', cartController.getCart);
router.post('/:userId/items', cartController.addItem);
router.delete('/:userId/items/:productId', cartController.removeItem);
router.delete('/:userId', cartController.clearCart);

export default router;

