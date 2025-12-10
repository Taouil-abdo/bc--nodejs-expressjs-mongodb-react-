import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const login = async (data) => {
    const user = await User.findOne({ email: data.email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const access_token = generateToken(user._id);
    const refresh_token = generateRefreshToken(user._id);

    return {
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            age: user.age,
            phoneNumber: user.phoneNumber,
            status: user.status,
            role: user.role
        },
        access_token,
        refresh_token
    };
};

const register = async (data) => {
    const existsAccount = await User.findOne({ email: data.email });
    if (existsAccount) {
        throw new Error('User already exists');
    }

    const hashPassword = await bcrypt.hash(data.password, 10);

    const newUser = await User.create({
        fullname: data.fullname,
        email: data.email,
        password: hashPassword,
        age: data.age,
        phoneNumber: data.phoneNumber,
        status: data.status || 'active',
        role: data.role
    });

    const access_token = generateToken(newUser._id);
    const refresh_token = generateRefreshToken(newUser._id);

    return {
        user: {
            id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            age: newUser.age,
            phoneNumber: newUser.phoneNumber,
            status: newUser.status,
            role: newUser.role
        },
        access_token,
        refresh_token
    };
};

const logout = async () => {
    return { message: 'Logged out successfully' };
};


export default { register, login , logout};