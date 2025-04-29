import express from 'express';
import * as wishlistController from '../controllers/wishlistController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.put('/move-to-cart/:productId', wishlistController.moveWishlistToCart);
router.delete('/:productId', wishlistController.removeFromWishlist);

export default router;
