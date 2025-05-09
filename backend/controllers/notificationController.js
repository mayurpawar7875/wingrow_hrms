const sendSMS = require('../config/msg91');
const Notification = require('../models/Notification');
const User = require('../models/User');

const sendRemindersToOrganizers = require('../services/reminderService');

// @desc    Manually trigger reminders to all organizers
// @route   POST /api/notifications/reminders
// @access  Private (or Public for testing)
exports.sendReminders = async (req, res) => {
  try {
    const result = await sendRemindersToOrganizers();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    Send reminder SMS to organizers
// @route   POST /api/notifications/remind
// @access  Private
exports.sendReminder = async (req, res) => {
  const { userId, message } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send SMS via MSG 91
    await sendSMS(user.phone, message);

    // Store notification record
    const notification = new Notification({
      user: user._id,
      message,
      sentAt: new Date()
    });

    await notification.save();

    res.status(200).json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.sendReminder = async (req, res) => {
  console.log("Reminder endpoint hit");
  res.status(200).json({ message: 'Reminder sent successfully' });
};

// @desc    Get notifications for a user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const { status } = req.query;

    const filters = { user: req.user.id };
    if (status) {
      filters.status = status;
    }

    const notifications = await Notification.find(filters).sort({ sentAt: -1 });

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    // Logic to mark notification as read
    res.status(200).json({ message: `Notification ${id} marked as read` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

