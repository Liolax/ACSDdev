import express from 'express';
import Product from '../models/ProductModel.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Seller: create product
router.post('/', auth, async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, seller: req.user._id });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Seller: update product
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products (market)
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

export default router;
