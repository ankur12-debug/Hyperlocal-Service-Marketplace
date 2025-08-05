import Provider from '../models/Provider.js';

export const addServiceToProvider = async (req, res) => {
  try {
    const providerId = req.user.id; // From token
    const { serviceId } = req.body;

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Check if service already exists;
    const alreadyAdded = provider.servicesOffered.includes(serviceId);
    if (alreadyAdded) {
      return res.status(400).json({ message: 'Service already registered by this provider.' });
    }

    //Add service and save;
    provider.servicesOffered.push(serviceId);
    await provider.save();

    res.status(200).json({ message: 'Service added successfully', provider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};