const User = require('../models/User');
const generateToken = require('../utils/jwtUtils');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: 'fail',
                message: 'User already exists'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                status: 'success',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id)
                }
            });
        }
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists and password is correct
        if (user && (await user.correctPassword(password, user.password))) {
            res.json({
                status: 'success',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                status: 'success',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } else {
            res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};
