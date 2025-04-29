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

// Trust proxies (important behind load balancers/proxies)
app.set('trust proxy', 1);

// Configure rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'development' ? 1000 : 100,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use(limiter);

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("MONGO_URI is not defined in your environment variables.");
    process.exit(1);
}
mongoose.connect(mongoURI, {
    // useNewUrlParser: true, // Deprecated in newer Mongoose versions
    // useUnifiedTopology: true, // Deprecated in newer Mongoose versions
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
})
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err.message, err.stack);
        process.exit(1);
    });

// --- CORS Configuration START ---
// Define allowed origins
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

// If you have a production frontend URL, add it here:
// if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
//   allowedOrigins.push(process.env.FRONTEND_URL);
// }

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // Allow cookies/authorization headers
};

// Apply CORS middleware globally with options
app.use(cors(corsOptions));
// --- CORS Configuration END ---

// Middleware
// Keep Helmet, but ensure COEP/COOP are disabled if they conflict with your setup
app.use(helmet({
    crossOriginEmbedderPolicy: false, // Disable COEP
    crossOriginOpenerPolicy: false, // Disable COOP
    // You might want to review other Helmet options as well
}));
app.disable('x-powered-by');
// app.use(cors({...})); // Removed from here, applied above

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Determine __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the uploads folder
const uploadsPath = path.join(__dirname, 'uploads');
console.log(`Serving static files from: ${uploadsPath}`);

// Middleware to add Cross-Origin-Resource-Policy header for uploads
// This is crucial if the frontend document has COEP: require-corp
app.use('/uploads', (req, res, next) => {
    // Set CORP header to allow embedding from any origin (less secure)
    // For better security, use 'same-origin' or 'same-site' if applicable
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
}, express.static(uploadsPath)); // Serve static files after adding the header


// --- Favicon.ico Fix START ---
// Serve favicon.ico from the public directory if it exists there
// Assuming your favicon is in backend/public/favicon.ico
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
app.get('/favicon.ico', (req, res) => {
    res.sendFile(faviconPath, (err) => {
        if (err) {
            console.error("Error serving favicon.ico:", err);
            // If favicon is not found in backend/public, send 404
            res.status(404).send('Favicon not found');
        }
    });
});
// If your favicon is in frontend/public, you might not need this backend route
// if the frontend development server handles it. But if the browser requests
// it from the backend, this will serve it.
// --- Favicon.ico Fix END ---


// API Routes (Keep these after middleware)
app.use('/api/products', productRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Base API route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the EireCraft API' });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
    // Handle CORS errors specifically if needed
    if (err.message.includes('CORS policy')) {
        console.error("CORS Error:", err.message);
        return res.status(403).json({ message: 'CORS policy violation: Access denied.' });
    }
    console.error("Global error handler caught:", err.stack);
    res.status(500).json({ message: err.message || 'An internal server error occurred.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
