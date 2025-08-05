// routes/reviewRoutes.js
import express from 'express';
import { addReview } from '../controller/rewiewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//add the review on the booking;
router.post('/add', protect, addReview);

export default router;
