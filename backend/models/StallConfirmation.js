const mongoose = require("mongoose");

const StallConfirmationSchema = new mongoose.Schema({
  marketName: { type: String, required: true }, // ✅ Ensure marketName is required
  marketDate: { type: Date, required: true },
  stallName: { type: String, required: true },
  farmerName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StallConfirmation", StallConfirmationSchema);
