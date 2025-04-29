import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

// Import API routes
import productRoutes from './routes/productRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';

dotenv.config();
const app = express();
app.set('trust proxy', 1);

// Configure rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 1000 : 100,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use(limiter);

// MongoDB connection with automatic retry handling
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("MONGO_URI is not defined in your environment variables.");
    process.exit(1);
}

mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
})
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1);
    });

// Handle unexpected MongoDB disconnects
mongoose.connection.on('disconnected', () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
    mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 30000 });
});

// CORS Configuration
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Blocked by CORS'), false);
    },
    credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
}));
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, 'uploads');

app.use('/uploads', (req, res, next) => {
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
}, express.static(uploadsPath));

// Favicon handling
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
app.get('/favicon.ico', (req, res) => res.sendFile(faviconPath));

// **Health Check Endpoint**
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: "API is running",
        uptime: process.uptime(),
        dbConnected: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

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
