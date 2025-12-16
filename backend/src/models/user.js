import mongoose from 'mongoose';

// Simple User model - password hashing is done in authService
const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    role: {
        type: String,
        enum: ['admin', 'driver'],
        default: 'driver'
    }
}, {
    timestamps: true
});

export default mongoose.model('User', UserSchema);

