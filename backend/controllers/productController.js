import Product from '../models/ProductModel.js';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

function isWithinUploads(filePath) {
  const normalizedPath = path.normalize(filePath);
  return normalizedPath.startsWith(UPLOADS_DIR);
}

async function safeDeleteFile(filePath) {
  try {
    if (isWithinUploads(filePath) && fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  } catch (err) {
    console.error('Error deleting file:', err);
  }
}

// GET /products - fetch all products
export async function fetchProducts(req, res) {
  try {
    const products = await Product.find().populate('seller', 'name');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
}

// GET /products/:id - fetch single product
export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name');
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching product.' });
  }
}

// GET /products/my - fetch user's products
export async function getMyProducts(req, res) {
  try {
    const products = await Product.find({ seller: req.user._id }).populate('seller', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your products.' });
  }
}

// POST /products - create product
export async function createProduct(req, res) {
  try {
    // Log incoming form fields for debugging
    console.log('Received form fields:', req.body);
    console.log('Received file:', req.file);

    const { name, price, description, category, tags } = req.body;
    // Defensive: check for missing fields
    if (!name || !price || !description || !category) {
      return res.status(400).json({ error: 'All fields (name, price, description, category) are required.' });
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ error: 'Valid price is required.' });
    }
    // Remove duplicate name check if you want to allow same name for different sellers
    // const existingProduct = await Product.findOne({ name });
    // if (existingProduct) {
    //   return res.status(400).json({ error: 'Product with this name already exists.' });
    // }
    let imagePath = req.file?.path;
    if (imagePath) {
      // Always store as relative path: uploads/filename
      const uploadsIndex = imagePath.replace(/\\/g, '/').indexOf('uploads/');
      if (uploadsIndex !== -1) {
        imagePath = imagePath.replace(/\\/g, '/').slice(uploadsIndex);
      } else {
        imagePath = imagePath.replace(/\\/g, '/');
      }
    }
    const newProduct = new Product({
      name: name.trim(),
      price: parsedPrice,
      description: description.trim(),
      image: imagePath, // <-- Save the normalized relative path
      category: category ? category.trim() : 'General',
      tags: tags
        ? typeof tags === 'string'
          ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
          : Array.isArray(tags) ? tags : []
        : [],
      seller: req.user._id // Set seller
    });
    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    console.error('Error creating product:', error, error?.stack);
    res.status(500).json({ error: 'An error occurred while creating the product.' });
  }
}

// PUT /products/:id - update product
export async function updateProduct(req, res) {
  try {
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
      // Normalize to relative path
      let newImagePath = req.file.path.replace(/\\/g, '/');
      const uploadsIndex = newImagePath.indexOf('uploads/');
      if (uploadsIndex !== -1) {
        newImagePath = newImagePath.slice(uploadsIndex);
      }
      updateData.image = newImagePath;
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
    res.status(500).json({ error: 'An error occurred while updating the product.' });
  }
}

// DELETE /products/:id - delete product
export async function deleteProduct(req, res) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: 'Product not found.' });
    if (deletedProduct.image && !deletedProduct.image.startsWith('http')) {
      const filePath = path.join(process.cwd(), deletedProduct.image);
      await safeDeleteFile(filePath);
    }
    res.status(200).json({ success: true, product: deletedProduct });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the product.' });
  }
}