import express from 'express';
import * as orderController from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/create', auth, orderController.createOrder);
router.get('/my-purchases', auth, orderController.getMyPurchases);
router.get('/my-sales', auth, orderController.getMySales);
router.get('/to-ship', auth, orderController.getOrdersToShip);
router.post('/mark-shipped', auth, orderController.markShipped);
router.post('/mark-delivered', auth, orderController.markDelivered);
router.post('/add-feedback', auth, orderController.addFeedback);

export default router;
