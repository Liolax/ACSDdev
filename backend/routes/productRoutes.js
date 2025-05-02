import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
} from '../controllers/productController.js';

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter: Only allow JPEG, PNG, and WEBP image types.
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WEBP are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

const router = Router();

// Securely serve product images by filename (handles both / and \ in DB)
router.get('/images/:filename', (req, res) => {
  // Normalize filename to prevent path traversal and handle backslashes
  let filename = req.params.filename.replace(/\\/g, '/');
  // Only allow safe filenames (alphanumeric, dash, underscore, dot, extension)
  if (!/^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|gif|webp)$/i.test(filename)) {
    return res.status(400).send('Invalid filename');
  }
  // Ensure the file exists in the uploads directory
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  const imagePath = path.resolve(uploadsDir, path.basename(filename));
  if (!imagePath.startsWith(uploadsDir + path.sep)) {
    return res.status(403).send('Forbidden');
  }
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Image not found');
    }
    res.sendFile(imagePath);
  });
});

router.get('/', fetchProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;