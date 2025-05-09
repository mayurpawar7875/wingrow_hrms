const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: [
      'update_stalls_confirmation',
      'mark_attendance',
      'upload_market_rate',
      'upload_market_setup_video',
      'collect_customer_feedback',
      'upload_reporting_sheet',
      'upload_cleaned_space_photo',
    ],
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Action', actionSchema);
