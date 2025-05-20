const GPSLocation = require('../models/GPSLocation'); // Import your schema/model

const uploadGPSWithSelfie = async (req, res) => {
  try {
    console.log("📡 Received GPS Upload Request:", req.body);
    console.log("📸 Selfie Path:", req.file?.path);

    const { latitude, longitude } = req.body;
    const selfiePath = req.file?.path;
    const userId = req.user.id; // Extracted from auth middleware

    if (!latitude || !longitude || !selfiePath) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const record = new GPSLocation({
      userId,
      latitude,
      longitude,
      selfiePath,
      timestamp: new Date(),
    });

    await record.save();
    res.status(201).json({ message: "✅ GPS location with selfie saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving GPS location with selfie:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// ✅ Export the function correctly
module.exports = {
  uploadGPSWithSelfie
};
