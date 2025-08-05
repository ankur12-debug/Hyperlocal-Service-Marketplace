// routes/paymentRoutes.js
import express from 'express';
import { createOrder, verifyPayment } from '../controller/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

export default router;
