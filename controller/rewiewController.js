//it's a conntroller for review system;
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { providerId, bookingId, rating, review } = req.body;

    // Check if booking exists and belongs to user
    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking) {
      return res.status(400).json({ message: 'Invalid booking or unauthorized' });
    }

    // Prevent duplicate review for same booking
    const existing = await Review.findOne({ bookingId });
    if (existing) {
      return res.status(400).json({ message: 'Review already submitted for this booking' });
    }

    const newReview = await Review.create({
      userId,
      providerId,
      bookingId,
      rating,
      review
    });

    res.status(201).json({ message: 'Review submitted successfully', newReview });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
