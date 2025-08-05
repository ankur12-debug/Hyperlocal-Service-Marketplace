import Booking from '../models/Booking.js';
import Provider from '../models/Provider.js';


// Create a booking
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { providerId, serviceId, date, timeSlot, address } = req.body;

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const pricingInfo = provider.pricing.find(p => p.serviceId.toString() === serviceId);
    if (!pricingInfo) {
      return res.status(400).json({ message: 'Service not offered by this provider' });
    }

    const amount = pricingInfo.price;// fetch correct price

    const booking = await Booking.create({
      userId,
      providerId,
      serviceId,
      date,
      timeSlot,
      address,
      amount
    });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};

// User: Get all their bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('providerId', 'userId')
      .populate('serviceId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Provider: Get bookings where they are assigned
export const getProviderBookings = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) return res.status(404).json({ message: 'Provider profile not found' });

    const bookings = await Booking.find({ providerId: provider._id })
      .populate('userId', 'name email')
      .populate('serviceId');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// PATCH /api/bookings/:bookingId/status (Only provider can update)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const validStatuses = ['accepted', 'rejected', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find provider based on current logged-in user
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(403).json({ message: 'Access denied. Not a provider' });
    }

    // Find booking and ensure it belongs to the provider
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this booking' });
    }

    // Update status
    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking status updated successfully', booking });

  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};
