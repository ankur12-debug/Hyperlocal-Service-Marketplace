import express from 'express';
import { addServiceToProvider } from '../controller/addServiceController.js';
import { protect, authorize } from '../middleware/auth.js';
import validateAddServiceInput from '../middleware/validateAddServiceInput.js';
import {
  registerProvider,
  getProviderProfile,
  updateProviderProfile,
  searchProviders,
  getProviderById,
  updateServicePrice,
  removeServiceFromProvider
} from '../controller/providerController.js';
import {getProviderBookings ,updateBookingStatus} from '../controller/bookingController.js'
import { updateLocation } from '../controller/updateLocation.js';

const router = express.Router();

//register the provider;
router.post('/register', protect, authorize('provider'), registerProvider);
//shows the profile pic;
router.get('/me', protect, authorize('provider'), getProviderProfile);
//update the profile;
router.put('/me', protect, authorize('provider'), updateProviderProfile);
//provider add service;
router.post('/services', protect, authorize('provider'), validateAddServiceInput, addServiceToProvider);
// Remove a service from provider;
router.delete('/services/:serviceId', protect, authorize('provider'), removeServiceFromProvider);
//to update the price;
router.put('/services/:serviceId', protect, authorize('provider'), updateServicePrice);
//to update provider's location;
router.put('/update-location', protect, authorize('provider'), updateLocation);
//show all their booking;
router.get('/bookings', protect, authorize('provider'), getProviderBookings);
//to update the booking status;
router.patch('/bookings/:bookingId/status', protect, updateBookingStatus);
//get /api/providers/search?category=Plumbing&lat=28.6&lng=77.2;
router.get('/search', searchProviders);
// routes/providerRoutes.js
router.get('/:id', getProviderById);

export default router;