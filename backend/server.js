import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoute.js';

dotenv.config();
connectDB();

const port = process.env.PORT || 8000;

const app = express();

app.use('/api', paymentRoutes);

const __dirname = path.resolve();
app.use('/assets', express.static(`${__dirname}/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.use(errorHandler);

app.use(express.static(path.join(__dirname, '/public/web')));

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/web/index.html'));
});

app.use(notFound);

app.listen(port, () => console.log(`Server running on port ${port}`));
