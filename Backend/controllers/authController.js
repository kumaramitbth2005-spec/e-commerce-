const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc Register new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        // Check DB connection first
        if (mongoose.connection.readyState !== 1) {
            console.error(' MongoDB is NOT connected. readyState:', mongoose.connection.readyState);
            return res.status(500).json({ message: 'Database not connected. Please check your MONGODB_URI in .env' });
        }

        const { name, email, password, collegeName, phone } = req.body;
        console.log('📝 Register attempt for:', email);

        if (!name || !email || !password || !collegeName) {
            return res.status(400).json({ message: 'Please fill all required fields (name, email, password, collegeName)' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = await User.create({
            name,
            email,
            password,
            collegeName,
            phone
        });

        if (user) {
            console.log('✅ User registered:', user.email);
            const token = generateToken(user._id);
            const refreshToken = generateRefreshToken(user._id);
            user.refreshToken = refreshToken;
            await user.save();
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                collegeName: user.collegeName,
                token,
                refreshToken
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(' Register error:', error.message);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
};

// @desc Auth user & get token
// @route POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        // Check DB connection first
        if (mongoose.connection.readyState !== 1) {
            console.error(' MongoDB is NOT connected. readyState:', mongoose.connection.readyState);
            return res.status(500).json({ message: 'Database not connected. Please check your MONGODB_URI in .env' });
        }

        const { email, password } = req.body;
        console.log('🔐 Login attempt for:', email);

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log(' No user found with email:', email);
            return res.status(401).json({ message: 'No account found with this email. Please register first.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(' Wrong password for:', email);
            return res.status(401).json({ message: 'Incorrect password. Please try again.' });
        }

        console.log('✅ Login successful for:', email);
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            collegeName: user.collegeName,
            token,
            refreshToken
        });
    } catch (error) {
        console.error(' Login error:', error.message);
        res.status(500).json({ message: error.message || 'Server error during login' });
    }
};

// @desc Refresh access token
// @route POST /api/auth/refresh
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET || process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);
        
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({
            token: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        console.error('Refresh token error:', error.message);
        res.status(401).json({ message: 'Refresh token verification failed or expired' });
    }
};

// @desc Logout user (clear refresh token)
// @route POST /api/auth/logout
const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            const user = await User.findOne({ refreshToken });
            if (user) {
                user.refreshToken = '';
                await user.save();
            }
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error.message);
        res.status(500).json({ message: 'Server error during logout' });
    }
};

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser };
