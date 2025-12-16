import authService from '../services/authService.js';

const register = async (req, res) => {
    try {
        const { fullname, email, password, age, phoneNumber, status, role } = req.body;
        const result = await authService.register({ fullname, email, password, age, phoneNumber, status, role });
        
        return res.status(201).json({
            message: 'User registered successfully',
            ...result
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message || 'Registration failed'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        
        return res.status(200).json({
            message: 'User logged in successfully',
            ...result
        });
    } catch (error) {
        return res.status(401).json({
            message: error.message || 'Invalid email or password'
        });
    }
};

const logout = async (req, res) => {
    try {
        const result = await authService.logout();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export { register, login, logout };