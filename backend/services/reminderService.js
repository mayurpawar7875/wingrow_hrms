const cron = require('node-cron');
// const sendSMS = require('../config/msg91');
const sendSMS = require('../config/msg91');
const User = require('../models/User');
const Notification = require('../models/Notification');

const sendRemindersToOrganizers = async () => {
  try {
    // Get all organizers
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
    
    console.log('Reminders sent to all organizers');
    return { success: true, message: 'Reminders sent successfully.' };
  } catch (error) {
    console.error('Error sending reminders:', error);
    throw new Error('Failed to send reminders.');
  }
};


// Schedule reminders for market setup video uploads at 2:00 PM
cron.schedule('0 14 * * *', async () => {
  try {
    const organizers = await User.find({ role: 'organizer' });

    for (const organizer of organizers) {
      const message = 'Reminder: Please upload the market setup video by 3:00 PM.';

      // Send SMS
      await sendSMS(organizer.phone, message);

      // Create notification record
      await Notification.create({
        user: organizer._id,
        message,
        actionType: 'upload_market_setup_video',
        sentAt: new Date(),
      });
    }

    console.log('Market setup video reminders sent at 2:00 PM');
  } catch (error) {
    console.error('Error sending video reminders:', error);
  }
});


module.exports = sendRemindersToOrganizers;
