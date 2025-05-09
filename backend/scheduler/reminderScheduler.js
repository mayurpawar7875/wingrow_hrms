const cron = require('node-cron');
const sendSMS = require('../config/msg91');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendRemindersToOrganizers = require('../services/reminderService');

// Schedule a task to run every day at 11:30 AM
cron.schedule('30 11 * * *', async () => {
  try {
    // Get all organizers (assuming role: 'organizer')
    const organizers = await User.find({ role: 'organizer' });

    // Prepare all notification promises
    const notificationPromises = organizers.map(async (organizer) => {
      const message = 'Reminder: Please update the stall confirmations list for today by 12:00 PM.';

      // Send SMS
      await sendSMS(organizer.phone, message);

      // Create notification record in the database
      const notification = new Notification({
        user: organizer._id,
        message,
        sentAt: new Date(),
      });

      return notification.save();
    });

    // Execute all promises concurrently
    await Promise.all(notificationPromises);

    console.log('Reminders sent to all organizers at 11:30 AM');
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
});


// Schedule a task to run every day at 11:30 AM
cron.schedule('30 11 * * *', async () => {
  try {
    await sendRemindersToOrganizers();
  } catch (error) {
    console.error('Error in scheduled reminder:', error);
  }
});

