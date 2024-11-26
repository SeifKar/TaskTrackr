const Notification = require('../models/Notification');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.getNotifications = catchAsync(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort('-createdAt')
        .limit(50);

    res.status(200).json(notifications);
});

exports.markAsRead = catchAsync(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json(notification);
});

exports.getNotificationPreferences = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({ notificationPreferences: user.notificationPreferences });
});

exports.updateNotificationPreferences = catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { notificationPreferences: req.body.notificationPreferences },
        { new: true, runValidators: true }
    );

    res.status(200).json({ notificationPreferences: user.notificationPreferences });
});
