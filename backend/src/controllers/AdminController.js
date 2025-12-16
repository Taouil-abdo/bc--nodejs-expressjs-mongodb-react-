import User from '../models/user.js';
import authService from '../services/authService.js';

// Simple function to create driver (admin only)
export const createDriver = async (req, res) => {
    try {
        const { fullname, email, password, age, phoneNumber } = req.body;
        const driverData = {
            fullname,
            email, 
            password,
            age,
            phoneNumber,
            role: 'driver' // Force role to driver
        };
        
        const result = await authService.register(driverData);
        
        return res.status(201).json({
            message: 'Driver created successfully',
            ...result
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message || 'Failed to create driver'
        });
    }
};

// Simple function to get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Failed to get users'
        });
    }
};

// Simple function to get user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Simple function to toggle user status
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Toggle status
        user.status = user.status === 'active' ? 'inactive' : 'active';
        await user.save();
        
        return res.status(200).json({
            message: 'User status updated successfully',
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                status: user.status,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};