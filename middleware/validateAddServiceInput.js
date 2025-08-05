import mongoose from 'mongoose';

// Helper function to check valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateAddServiceInput = (req, res, next) => {
  const { serviceId } = req.body;

  // Validate serviceId in body;
  if (!serviceId) {
    return res.status(400).json({ message: 'Missing serviceId in body.' });
  }

  if (!isValidObjectId(serviceId)) {
    return res.status(400).json({ message: 'Invalid serviceId.' });
  }

  // Validate providerId from JWT (req.user.id);
  if (!req.user?.id || !isValidObjectId(req.user.id)) {
    return res.status(400).json({ message: 'Invalid provider ID from token.' });
  }

  next();
};

export default validateAddServiceInput;
