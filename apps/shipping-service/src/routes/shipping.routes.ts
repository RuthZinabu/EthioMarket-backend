import { Router } from 'express';
import shippingController from '../controllers/shipping.controller';

const router: Router = Router();

router.post('/', shippingController.createShipment);
router.get('/track/:trackingNumber', shippingController.getShipmentByTracking);
router.get('/order/:orderId', shippingController.getShipmentByOrder);
router.patch('/:id/status', shippingController.updateShipmentStatus);
router.get('/health', shippingController.healthCheck);

export default router;
