import { Router } from 'express';
import Product from '../models/ProductModel';
const router = Router();

// GET /api/products - Retrieve all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // Sort by newest first
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: 'Error fetching products', error });
  }
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, image, description } = req.body;

    // Validation
    if (!name || price === undefined || price < 0) {
      return res.status(400).json({ message: 'Valid name and price are required.' });
    }

    const newProduct = new Product({ name, price, image, description });
    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: 'Error creating product', error });
  }
});

// PUT /api/products/:id - Update an existing product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Run validations on update
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: 'Error updating product', error });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: 'Error deleting product', error });
  }
});

export default router;
