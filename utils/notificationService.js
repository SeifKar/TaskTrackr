const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const notificationService = {
    // Create a new notification
    async createNotification(userId, title, message, type, taskId = null) {
        try {
            const notification = await Notification.create({
                user: userId,
                title,
                message,
                type,
                relatedTask: taskId,
                isRead: false,
                createdAt: new Date()
            });

            // Get user's notification preferences
            const user = await User.findById(userId);
            if (user && user.notificationPreferences.email.enabled) {
                await this.sendEmailNotification(user.email, title, message);
            }

            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    },

    // Send email notification
    async sendEmailNotification(userEmail, subject, message) {
        try {
            console.log('Sending email to:', userEmail);
            const info = await transporter.sendMail({
                from: process.env.EMAIL_FROM || '"TaskTrackr" <notifications@tasktrackr.com>',
                to: userEmail,
                subject: subject,
                text: message,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
                            <h2 style="color: #1976d2; margin-top: 0;">${subject}</h2>
                            <p style="color: #333; font-size: 16px; line-height: 1.5;">${message}</p>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                            <p style="color: #666; font-size: 12px;">
                                This is an automated notification from TaskTrackr.<br>
                                You can manage your notification preferences in your account settings.
                            </p>
                        </div>
                    </div>
                `
            });
            console.log('Email sent successfully:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    },

    // Handle deadline notifications
    async sendDeadlineReminder(task, user) {
        const title = `Task Deadline Reminder: ${task.title}`;
        const message = `The task "${task.title}" is due on ${new Date(task.deadline).toLocaleString()}`;
        
        if (user.notificationPreferences.email.deadlineReminder) {
            await this.createNotification(user._id, title, message, 'deadline', task._id);
        }
    },

    // Handle status change notifications
    async sendStatusChangeNotification(task, user, oldStatus, newStatus) {
        const title = `Task Status Updated: ${task.title}`;
        const message = `The status of task "${task.title}" has been changed from ${oldStatus} to ${newStatus}`;
        
        if (user.notificationPreferences.email.statusChanges) {
            await this.createNotification(user._id, title, message, 'status', task._id);
        }
    },

    // Get user's unread notifications
    async getUnreadNotifications(userId) {
        try {
            return await Notification.find({
                user: userId,
                isRead: false
            }).sort('-createdAt');
        } catch (error) {
            console.error('Error getting unread notifications:', error);
            throw error;
        }
    },

    // Mark notification as read
    async markAsRead(notificationId) {
        try {
            return await Notification.findByIdAndUpdate(
                notificationId,
                { isRead: true },
                { new: true }
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }
};

module.exports = notificationService;
