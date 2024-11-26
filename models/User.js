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
    try {
        if (!this.isModified('password')) {
            return next();
        }
        
        console.log('Hashing password for user:', this.email);
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Password hashed successfully');
        next();
    } catch (error) {
        console.error('Error hashing password:', error);
        next(error);
    }
});

// Method to check if password matches
userSchema.methods.matchPassword = async function(enteredPassword) {
    try {
        if (!this.password) {
            console.error('No password hash found for user:', this.email);
            return false;
        }
        console.log('Stored password hash:', this.password);
        console.log('Entered password:', enteredPassword);
        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        console.log('Password comparison details:', {
            email: this.email,
            passwordHash: this.password,
            enteredPassword: enteredPassword,
            isMatch: isMatch
        });
        return isMatch;
    } catch (error) {
        console.error('Password comparison error for user:', this.email, error);
        return false;
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
