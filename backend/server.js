import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import path from 'path';
import axios from 'axios';

import productRoutes from './routes/productRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';

const app = express();

// Enable trust proxy to fix express-rate-limit warning
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 1000 : 100,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use(limiter);

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("MONGO_URI is not defined in your environment variables.");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

mongoose.connection.on('disconnected', () => {
  console.warn("MongoDB disconnected. Attempting to reconnect...");
  mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 30000 });
});

const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
  if (process.env.FRONTEND_URL.startsWith('http')) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS'), false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // <-- Commented out to fix path-to-regexp error

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  })
);
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (must be before static and routes)
app.use(cors(corsOptions));

// Serve static files from the 'uploads' directory with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(process.cwd(), 'uploads')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes); // <-- Ensure this is /api/orders
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Example proxy endpoint for GeoDB Cities API
app.get('/api/geodb/cities', async (req, res) => {
  try {
    const { country, city } = req.query;
    const apiKey = process.env.GEODB_API_KEY; // Set this in your .env file
    const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
      params: { countryIds: country, namePrefix: city },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler caught:", err.stack);
  res.status(500).json({ message: err.message || 'An internal server error occurred.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
