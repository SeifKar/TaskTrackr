const User = require('../models/User');
const generateToken = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login request received:', { email, password: '***' });
        
        if (!email || !password) {
            console.log('Missing credentials');
            return res.status(400).json({ 
                message: 'Please provide both email and password' 
            });
        }

        console.log('Looking up user with email:', email);
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            console.log('No user found with email:', email);
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        console.log('User found:', {
            id: user._id,
            email: user.email,
            hasPassword: !!user.password
        });

        const isPasswordValid = await user.matchPassword(password);
        console.log('Password validation result:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        const token = generateToken(user._id);
        console.log('Login successful for user:', email);
        
        const response = {
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        };
        console.log('Sending response:', { ...response, token: '***' });
        
        res.json(response);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Error logging in. Please try again.' 
        });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        res.json({
            status: 'success',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                notificationPreferences: user.notificationPreferences
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};
