import express from 'express';
import * as cartController from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Protect all cart routes

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:productId', cartController.updateCartItem);
router.delete('/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
