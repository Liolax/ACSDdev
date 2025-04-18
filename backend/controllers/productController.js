import Product from '../models/ProductModel.js';

// Retrieve list of products
export async function getProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // Retrieve products sorted by newest
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
}

// Get a product by its ID
export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'An error occurred while fetching product.' });
  }
}

// Create a new product
export async function createProduct(req, res) {
  try {
    const { name, price, description, image } = req.body;

    // Validate required fields
    if (!name || price === undefined || price < 0) {
      return res.status(400).json({ error: 'Valid name and price are required.' });
    }

    const newProduct = new Product({ name, price, description, image });
    const savedProduct = await newProduct.save();

    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'An error occurred while creating the product.' });
  }
}

// Update an existing product
export async function updateProduct(req, res) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Run validations on update
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'An error occurred while updating the product.' });
  }
}

// Delete a product
export async function deleteProduct(req, res) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.status(200).json({ success: true, product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'An error occurred while deleting the product.' });
  }
}
