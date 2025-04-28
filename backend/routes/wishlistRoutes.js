import { Router } from 'express';
import { getWishlist, addWishlistItem, removeWishlistItem } from '../controllers/wishlistController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', getWishlist);
router.post('/', addWishlistItem);
router.delete('/:id', removeWishlistItem);

export default router;
