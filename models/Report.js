const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attendance: {
    marked: {
      type: Boolean,
      required: true,
      default: false,
    },
    location: String, // Location where attendance was marked
    selfie: String, // URL of the selfie
    markedAt: Date, // Time of attendance
  },
  gpsValidations: [
    {
      latitude: Number,
      longitude: Number,
      isValid: Boolean,
      validationDate: Date,
    },
  ],
  actionsPerformed: [
    {
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
      },
      completedAt: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);
