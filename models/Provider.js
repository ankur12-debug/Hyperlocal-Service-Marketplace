import mongoose from 'mongoose';

const ProviderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bio: String,
    servicesOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }],
    pricing: [
        {
            serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
            price: { type: Number, required: true, min: 0 }
        }
    ],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    isApproved: { type: Boolean, default: false },
    location: {
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
    },
    coordinates: {
        type: [Number], // [lng, lat]
        required: true
    }
}
},
    { timestamps: true }
);

//compound indexing for fast db search and sorting;
ProviderSchema.index({ servicesOffered: 1, averageRating: -1 });

//Index to support geospatial queries like $near;
ProviderSchema.index({ location: '2dsphere' });

const Provider = mongoose.model('Provider', ProviderSchema);
export default Provider;