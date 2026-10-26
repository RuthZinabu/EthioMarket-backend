import { Router } from 'express';
import orderController from '../controllers/order.controller';

const router: Router = Router();

router.post('/create', orderController.createOrder);
router.get('/health-check', orderController.healthCheck);
router.get('/user/:userId', orderController.getOrdersByUserId);
router.get('/vendor/:vendorId', orderController.getOrdersByVendorId);
router.get('/detail/:id', orderController.getOrderById);
router.patch('/update/:id/status', orderController.updateOrderStatus);

export default router;
