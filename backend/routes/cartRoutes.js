import express from 'express';
import * as cartController from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

router.get('/', cartController.getCart);
router.post('/add-item', cartController.addToCart);
router.put('/update-item/:productId', cartController.updateCartItem);
router.delete('/remove-item/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

export default router;