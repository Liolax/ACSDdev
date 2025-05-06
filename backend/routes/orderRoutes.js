import express from 'express';
import * as orderController from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/create', auth, orderController.createOrder);
router.post('/:orderId/simulate-payment', auth, orderController.simulatePayment);

// Return all order items sold by this seller (flattened, with orderId)
router.get('/my-sales', auth, orderController.getMySalesItems);

// Return all order items to ship for this seller (flattened, with orderId)
router.get('/to-ship', auth, orderController.getOrderItemsToShip);

router.get('/my-purchases', auth, orderController.getMyPurchases);
router.post('/mark-shipped', auth, orderController.markShipped);
router.post('/mark-delivered', auth, orderController.markDelivered);
router.post('/add-feedback', auth, orderController.addFeedback);
router.post('/edit-feedback', auth, orderController.editFeedback);
router.post('/delete-feedback', auth, orderController.deleteFeedback);

export default router;
