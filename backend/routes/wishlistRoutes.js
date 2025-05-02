import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist, moveWishlistToCart } from '../controllers/wishlistController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getWishlist);
router.post('/add-item', auth, addToWishlist);
router.delete('/remove-item/:productId', auth, removeFromWishlist);
router.put('/move-to-cart/:productId', auth, moveWishlistToCart);

export default router;
