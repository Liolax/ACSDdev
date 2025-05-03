import express from 'express';
import auth from '../middleware/auth.js';
import * as orderController from '../controllers/orderController.js';

// All order routes are protected by auth middleware.
const router = express.Router();
router.use(auth);

router.post('/', orderController.createOrder);

// Add this route for payment simulation (must come before any route with :orderId or :id)
router.post('/:orderId/simulate-payment', orderController.simulatePayment);

router.get('/my-purchases', orderController.getMyPurchases);
router.get('/my-sales', orderController.getMySales);
router.put('/:orderId/ship', orderController.markShipped);
router.put('/:orderId/deliver', orderController.markDelivered);

// Keep this generic :id route LAST to avoid conflicts
router.get('/:id', (req, res) => {
  // handler code
});

export default router;
