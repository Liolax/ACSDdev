import Product from '../models/ProductModel.js';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Helper: Verify that a file path is within the uploads directory.
function isWithinUploads(filePath) {
  const normalizedPath = path.normalize(filePath);
  return normalizedPath.startsWith(UPLOADS_DIR);
}

// Helper: Safely delete a file (only if inside uploads/)
async function safeDeleteFile(filePath) {
  try {
    if (isWithinUploads(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } else {
      console.error('Attempt to delete file outside uploads directory:', filePath);
    }
  } catch (err) {
    console.error('Error deleting file:', err);
  }
}

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
    if (!req.params.id) {
      return res.status(400).json({ error: 'Product id is required.' });
    }
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
    const { name, price, description, category, tags } = req.body;
    const parsedPrice = parseFloat(price);
    if (!name || isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ error: 'Valid name and price are required.' });
    }
    
    let imagePath = '';
    if (req.file) {
      imagePath = req.file.path; // e.g. "uploads/image-XYZ.jpg"
    }
    
    const newProduct = new Product({
      name,
      price: parsedPrice,
      description,
      image: imagePath,
      category: category ? category.trim() : 'General',
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : []
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
    if (!req.params.id) {
      return res.status(400).json({ error: 'Product id is required.' });
    }
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ error: 'Product not found.' });
    
    let updateData = {};
    
    if (req.body.name) updateData.name = req.body.name.trim();
    if (req.body.price) {
      const parsedPrice = parseFloat(req.body.price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ error: 'Invalid price value.' });
      }
      updateData.price = parsedPrice;
    }
    if (req.body.description) updateData.description = req.body.description.trim();
    if (req.body.category) updateData.category = req.body.category.trim();
    if (req.body.tags) {
      updateData.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    }
    
    if (req.file) {
      updateData.image = req.file.path;
      if (existingProduct.image && !existingProduct.image.startsWith('http')) {
        const oldFilePath = path.join(process.cwd(), existingProduct.image);
        await safeDeleteFile(oldFilePath);
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
    if (!req.params.id) {
      return res.status(400).json({ error: 'Product id is required.' });
    }
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: 'Product not found.' });
    if (deletedProduct.image && !deletedProduct.image.startsWith('http')) {
      const filePath = path.join(process.cwd(), deletedProduct.image);
      await safeDeleteFile(filePath);
    }
    res.status(200).json({ success: true, product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ error: 'An error occurred while deleting the product.' });
  }
}
