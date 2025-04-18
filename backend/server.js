import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet'; // Import Helmet for secure HTTP headers

import productRoutes from './routes/productRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Use Helmet to set various secure HTTP headers
app.use(helmet());

// Explicitly disable the X-Powered-By header to hide Express usage info
app.disable('x-powered-by');

// Middleware Setup
app.use(cors()); // Enable CORS for all routes
app.use(json()); // Parse incoming JSON data

// Routes
app.use('/api/products', productRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);

// Catch-all for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
