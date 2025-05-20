// backend/models/MarketFile.js
const mongoose = require('mongoose');

const marketFileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Employee' if you are using Employee schema
    required: true,
  },
  marketName: {
    type: String,
    required: true,
  },
  marketDate: {
    type: String,
    required: true,
  },
  fileType: {
    type: String, // 'market_video' or 'cleaning_video'
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const MarketFile = mongoose.model('MarketFile', marketFileSchema);
module.exports = MarketFile;
