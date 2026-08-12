import { Router } from 'express';
import orderController from '../controllers/order.controller';

const router: Router = Router();

router.post('/', orderController.createOrder);
router.get('/health', orderController.healthCheck);
router.get('/user/:userId', orderController.getOrdersByUserId);
router.get('/vendor/:vendorId', orderController.getOrdersByVendorId);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);

export default router;
