const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000']
        }
    },
    crossOriginEmbedderPolicy: false
}));

// Enable gzip compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
    message: {
        status: 'error',
        message: 'Too many requests, please try again later.'
    }
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10kb' }));

// Request logging
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// MongoDB Connection with retry logic
const connectDB = async (retries = 5) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        if (retries > 0) {
            console.log(`MongoDB connection failed. Retrying... (${retries} attempts left)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        } else {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }
};
connectDB();

// Routes
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// API routes with version prefix
const API_VERSION = '/api/v1';
app.use(`${API_VERSION}/tasks`, taskRoutes);
app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/notifications`, notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Operational errors
    if (err.isOperational) {
        return res.status(err.statusCode || 400).json({
            status: 'error',
            message: err.message
        });
    }

    // MongoDB errors
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        if (err.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'Duplicate key error. This record already exists.'
            });
        }
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: Object.values(err.errors).map(e => e.message).join(', ')
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid or expired token. Please log in again.'
        });
    }

    // Production vs Development error response
    if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong. Please try again later.'
        });
    }

    // Development error response
    return res.status(500).json({
        status: 'error',
        message: err.message,
        stack: err.stack,
        error: err
    });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err);
    process.exit(1);
});
