//create provider , update the provider info and shows the provider profile;
import Provider from '../models/Provider.js';
import Service from '../models/Service.js';

//Create provider profile
export const registerProvider = async (req, res) => {
  try {
    const userId = req.user.id;

    // Prevent duplicate provider registration
    const existing = await Provider.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'Provider profile already exists.' });
    }

    const {
      bio,
      servicesOffered,
      pricing,
      location
    } = req.body;

    const provider = await Provider.create({
      userId,
      bio,
      servicesOffered,
      pricing,
      location
    });

    res.status(201).json({
      message: 'Provider registered successfully.',
      provider
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get current provider profile;
export const getProviderProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const provider = await Provider.findOne({ userId }).populate('servicesOffered');

    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found.' });
    }

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update provider profile;
export const updateProviderProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updates = req.body;

    const provider = await Provider.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found.' });
    }

    res.json({
      message: 'Provider profile updated successfully.',
      provider
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Search providers (by category + location);
export const searchProviders = async (req, res) => {
  try {
    const { category, lat, lng } = req.query;

    if (!category || !lat || !lng) {
      return res.status(400).json({ message: 'Category, latitude and longitude are required' });
    }

    // Step 1: Find all services matching the category
    const services = await Service.find({ category });
    const serviceIds = services.map(service => service._id);

    // Step 2: Find providers offering those services and near the user
    const providers = await Provider.find({
      servicesOffered: { $in: serviceIds },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 5000 // 5 km
        }
      },
      isApproved: true
    })
      .populate('servicesOffered')
      .sort({ averageRating: -1 }); //Sorted by rating

    res.status(200).json({ providers });

  } catch (error) {
    console.error(
      `Search failed for category="${req.query.category}", lat=${req.query.lat}, lng=${req.query.lng}:`,
      error
    );
    res.status(500).json({ message: 'Server error while searching providers' });
  }
};

//Get a provider by ID (for user detail view)
export const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('servicesOffered')
      .populate('userId', 'name email phone');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.status(200).json({ provider });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//update the price of service;
export const updateServicePrice = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { serviceId } = req.params;
    const { price } = req.body;

    if (!price || price < 0) {
      return res.status(400).json({ message: 'Invalid price' });
    }

    const provider = await Provider.findOne({ userId: providerId });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Check if the service exists in provider's pricing
    const serviceEntry = provider.pricing.find(p => p.serviceId.toString() === serviceId);
    if (!serviceEntry) {
      return res.status(400).json({ message: 'Service not offered by this provider' });
    }

    // Update the price
    serviceEntry.price = price;
    await provider.save();

    res.json({
      message: 'Service price updated successfully',
      updatedPricing: provider.pricing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Remove a service from provider's list
export const removeServiceFromProvider = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { serviceId } = req.params;

    const provider = await Provider.findOne({ userId: providerId });

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Filter out the service from servicesOffered
    const updatedServices = provider.servicesOffered.filter(
      s => s.toString() !== serviceId
    );

    // Also remove pricing entry
    const updatedPricing = provider.pricing.filter(
      p => p.serviceId.toString() !== serviceId
    );

    provider.servicesOffered = updatedServices;
    provider.pricing = updatedPricing;

    await provider.save();

    res.json({
      message: 'Service removed successfully',
      servicesOffered: provider.servicesOffered,
      pricing: provider.pricing
    });

  } catch (error) {
    console.error('Error removing service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
