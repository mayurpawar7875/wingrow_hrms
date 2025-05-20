const mongoose = require("mongoose");

const MarketListSchema = new mongoose.Schema({
    location: { type: String, required: true, unique: true } // Store only market locations
});

module.exports = mongoose.model("MarketList", MarketListSchema);
