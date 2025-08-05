// models/Booking.js
import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },

  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g., "10:00 AM - 11:00 AM"
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  amount: { type: Number, required: true }
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;