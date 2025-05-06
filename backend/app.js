import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import cors from 'cors';

const app = express();

mongoose.connect('mongodb://localhost:27017/market_db', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.use('/api', routes);

export default app;
