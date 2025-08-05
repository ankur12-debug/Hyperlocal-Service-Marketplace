//It is a updatelocation controller that check the sender is user or provider then also check it send valid coordinate then use findById method and update the location of user/provider;
import User from '../models/User.js';
import Provider from '../models/Provider.js';

export async function updateLocation(req, res) {
  try {
    const userId = req.user.id;

    if (!['user', 'provider'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only users and providers can update location' });
    }

    const { coordinates } = req.body;

    if (
      !Array.isArray(coordinates) ||
      coordinates.length !== 2 ||
      typeof coordinates[0] !== 'number' ||
      typeof coordinates[1] !== 'number'
    ) {
      return res.status(400).json({ message: 'Invalid coordinates format. Expected [lng, lat]' });
    }

    //Update location in User schema;
    const user = await User.findByIdAndUpdate(
      userId,
      { location: { type: 'Point', coordinates } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //If role is provider, update Provider collection too;
    if (req.user.role === 'provider') {
      await Provider.findOneAndUpdate(
        { userId: userId },
        { location: { type: 'Point', coordinates } }
      );
    }

    res.json({
      message: 'Location updated successfully!',
      location: user.location
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}