import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import connectDB from './config/db.js';
import './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import providerRoutes from './routes/providerRoutes.js'
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import {protect , authorize} from './middleware/auth.js'
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';




//fix __dirname for EMS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//load .env from root 
dotenv.config({path: path.resolve(__dirname, '../.env') });

connectDB();

const app = express();
// Only enable morgan in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(cors({origin: process.env.FRONTEND_URL, credentials:true}));
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/review' , reviewRoutes);
app.use('/api/payment', paymentRoutes);


const PORT = process.env.PORT || 8600;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));