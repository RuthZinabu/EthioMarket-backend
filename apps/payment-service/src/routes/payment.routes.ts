import { Router } from 'express';
import paymentController from '../controllers/payment.controller';

const router: Router = Router();

router.post('/process', paymentController.processPayment);
router.get('/health', paymentController.healthCheck);
router.get('/order/:orderId', paymentController.getPaymentsByOrderId);
router.get('/customer/:customerId', paymentController.getPaymentsByCustomerId);
router.get('/:paymentId', paymentController.getPaymentById);

export default router;
