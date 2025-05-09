const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  actionType: {
    type: String,
    enum: [
      'update_stalls_confirmation',
      'mark_attendance',
      'upload_market_rate',
      'upload_market_setup_video',
      'submit_daily_report',
      'collect_customer_feedback',
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ['sent', 'read'],
    default: 'sent',
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  readAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
