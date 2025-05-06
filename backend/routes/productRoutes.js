import express from 'express';
import Product from '../models/ProductModel.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    // Use timestamp + original name for uniqueness
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// Seller: create product (with image upload)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    let imagePath = req.file?.path;
    if (imagePath) {
      const uploadsIndex = imagePath.replace(/\\/g, '/').indexOf('uploads/');
      if (uploadsIndex !== -1) {
        imagePath = imagePath.replace(/\\/g, '/').slice(uploadsIndex);
      } else {
        imagePath = imagePath.replace(/\\/g, '/');
      }
    }
    const product = await Product.create({ ...req.body, seller: req.user._id, image: imagePath });
    // Return updated product list for this seller
    const products = await Product.find({ seller: req.user._id });
    res.status(201).json({ product, products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Seller: update product (with image upload)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      let imagePath = req.file.path.replace(/\\/g, '/');
      const uploadsIndex = imagePath.indexOf('uploads/');
      if (uploadsIndex !== -1) {
        imagePath = imagePath.slice(uploadsIndex);
      }
      updateData.image = imagePath;
    }
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      updateData,
      { new: true }
    );
    // Return updated product list for this seller
    const products = await Product.find({ seller: req.user._id });
    res.json({ product, products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Seller: delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
    // Return updated product list for this seller
    const products = await Product.find({ seller: req.user._id });
    res.json({ product, products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products (market)
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get current user's products
router.get('/my', auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;