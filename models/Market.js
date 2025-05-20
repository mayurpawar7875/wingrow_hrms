// const mongoose = require('mongoose');

// const MarketSchema = new mongoose.Schema({
//   location: {
//     type: String,
//     required: true
//   },
//   date: {
//     type: Date,
//     required: true
//   },
//   startTime: {
//     type: String,
//     required: true
//   },
//   endTime: {
//     type: String,
//     required: true
//   },
//   organizer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }
// });

// module.exports = mongoose.model('Market', MarketSchema);

const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  }
}, { collection: 'marketlists' }); // ✅ explicitly point to the correct collection

const Market = mongoose.model('Market', marketSchema);
module.exports = Market;
