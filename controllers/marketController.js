const Market = require('../models/Market'); // ✅ This model should point to 'marketlists'

exports.getAllMarkets = async (req, res) => {
  try {
    const markets = await Market.find({}, "location"); // Only return `location` field
    res.status(200).json(markets);
  } catch (error) {
    console.error("Error fetching markets:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
