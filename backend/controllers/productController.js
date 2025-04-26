import Product from '../models/ProductModel.js';
import fs from 'fs';
import path from 'path';

// Retrieve all products
export async function getProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
}

// Retrieve a product by its ID
export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'An error occurred while fetching product.' });
  }
}

// Create a new product
export async function createProduct(req, res) {
  try {
    const { name, price, description } = req.body;
    const parsedPrice = parseFloat(price);
    if (!name || isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ error: 'Valid name and price are required.' });
    }
    
    let imagePath = '';
    if (req.file) {
      imagePath = req.file.path;
    }
    
    const newProduct = new Product({
      name,
      price: parsedPrice,
      description,
      image: imagePath
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ error: 'An error occurred while creating the product.' });
  }
}

// Update an existing product
export async function updateProduct(req, res) {
  try {
    // Find the existing product to get its current image
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ error: 'Product not found.' });
  
    let updateData = req.body;
    if (updateData.price) {
      const parsedPrice = parseFloat(updateData.price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ error: 'Invalid price value.' });
      }
      updateData.price = parsedPrice;
    }
    if (req.file) {
      updateData.image = req.file.path;
      // Delete the old image if it exists and is local (not starting with 'http')
      if (existingProduct.image && !existingProduct.image.startsWith('http')) {
        const oldFilePath = path.join(process.cwd(), existingProduct.image);
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error('Error deleting old image file:', err);
          } else {
            console.log(`Deleted old image file: ${oldFilePath}`);
          }
        });
      }
    }
  
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found.' });
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ error: 'An error occurred while updating the product.' });
  }
}

// Delete a product
export async function deleteProduct(req, res) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: 'Product not found.' });
    // Delete associated image file if it exists and is local
    if (deletedProduct.image && !deletedProduct.image.startsWith('http')) {
      const filePath = path.join(process.cwd(), deletedProduct.image);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        } else {
          console.log('Successfully deleted orphan image file:', filePath);
        }
      });
    }
    res.status(200).json({ success: true, product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ error: 'An error occurred while deleting the product.' });
  }
}
