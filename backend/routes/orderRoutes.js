import { Router } from 'express';
import {
  getOrders,
  createOrder,
  markShipped,
  markDelivered,
  addFeedback,
} from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders); // Get all orders for current user
router.post('/', createOrder); // Create order after payment/shipping
router.patch('/:id/ship', markShipped); // Seller marks as shipped
router.patch('/:id/deliver', markDelivered); // Buyer marks as delivered
router.patch('/:id/feedback', addFeedback); // Buyer leaves feedback

export default router;