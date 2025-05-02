import express from 'express';
import * as orderController from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All order routes are protected by auth middleware.
router.use(auth);

router.post('/', orderController.createOrder);
router.post('/:orderId/paymentSimulation', orderController.simulatePayment);
router.get('/my-purchases', orderController.getMyPurchases);
router.get('/my-sales', orderController.getMySales);
router.put('/:orderId/ship', orderController.markShipped);
// BAD (causes error!):
// router.put('/:orderId:/ship', orderController.markShipped);
// router.put('/:orderId:/ship', ...);
// router.get('/:') <-- BAD
router.put('/:orderId/deliver', orderController.markDelivered);

export default router;
