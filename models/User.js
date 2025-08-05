//It's a user Schema, created in bd;
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String, unique: true, required:true },
    role: { type: String, enum: ['user', 'provider', 'admin'], default: 'user' },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
    },

    //Location field for geo search and tracking;
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
}, { timestamps: true });

//2dsphere index for geo queries;
userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;