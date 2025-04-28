import { Router } from 'express';
import {
  getOrders,
  createOrder,
  markShipped,
  markDelivered,
  addFeedback,
  getSales, 
} from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders);
router.get('/sales', getSales); 
router.post('/', createOrder);
router.patch('/:id/ship', markShipped);
router.patch('/:id/deliver', markDelivered);
router.patch('/:id/feedback', addFeedback);

export default router;
