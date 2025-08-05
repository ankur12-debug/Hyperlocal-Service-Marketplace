//It's a controller that registers or login the user/provider manually;
import { hash, compare } from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
const { sign } = jwt;


//function to register the user
export async function register(req, res) {
    try {
        const { name, email, password, role,  address} = req.body;
        const exist = await User.findOne({ email });
        if (exist) return res.status(400).json({ message: 'you already have an account!' });

        const hashed = await hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role,  address});

        const token = sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        const { password: _, ...userInfo } = user._doc;
        res.status(201).json({ message: 'User registered successfully!', token, user: userInfo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Function to login
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const match = await compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid email or password' });

        const token = sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            message: 'Login Successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}