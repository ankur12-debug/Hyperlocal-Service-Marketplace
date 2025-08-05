//It is route for updating the location of user and provider;
import express from 'express';
import { updateUserProfile ,getUserProfile } from '../controller/userController.js';
import { updateLocation } from '../controller/updateLocation.js';
import { protect , authorize} from '../middleware/auth.js';
import {createBooking , getUserBookings} from '../controller/bookingController.js'

const router = express.Router();

//update the profile;
router.patch('/me', protect, updateUserProfile);
//get the profile;
router.get('/profile', protect, getUserProfile);
//Route for users and providers to update location;
router.put('/update-location', protect, updateLocation);
// Book a service
router.post('/book', protect, authorize('user'), createBooking);
// Get all bookings of logged-in user
router.get('/user', protect, authorize('user'), getUserBookings);

export default router;
