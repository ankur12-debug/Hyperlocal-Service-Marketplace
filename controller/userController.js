//to update the profile of the user;
import User from '../models/User.js';

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Prevent email from being updated directly
    if (updates.email) {
      return res.status(400).json({ message: 'Email cannot be updated' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password'); // don’t return password

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


//get their profile;
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // password hide
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};