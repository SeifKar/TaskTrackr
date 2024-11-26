const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    notificationPreferences: {
        email: {
            enabled: { type: Boolean, default: true },
            deadlineReminder: { type: Boolean, default: true },
            statusChanges: { type: Boolean, default: true },
            assignments: { type: Boolean, default: true }
        },
        pushNotifications: {
            enabled: { type: Boolean, default: true },
            deadlineReminder: { type: Boolean, default: true },
            statusChanges: { type: Boolean, default: true },
            assignments: { type: Boolean, default: true }
        },
        reminderTiming: {
            type: String,
            enum: ['1hour', '3hours', '1day', '2days', '1week'],
            default: '1day'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to check if password matches
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
