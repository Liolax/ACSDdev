import express from 'express';
import * as cartController from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const cart = await cartController.getCart(req.user);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.post('/add-item', async (req, res, next) => {
  try {
    const cart = await cartController.addToCart(req.user, req.body);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.put('/update-item/:productId', async (req, res, next) => {
  try {
    const cart = await cartController.updateCartItem(req.user, req.params.productId, req.body);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.delete('/remove-item/:productId', async (req, res, next) => {
  try {
    const cart = await cartController.removeFromCart(req.user, req.params.productId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.delete('/clear', async (req, res, next) => {
  try {
    const cart = await cartController.clearCart(req.user);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

export default router;