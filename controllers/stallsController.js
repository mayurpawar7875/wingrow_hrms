const StallConfirmation = require("../models/StallConfirmation");

// ✅ FIXED: Submit Stall Confirmation List
exports.submitStallConfirmation = async (req, res) => {
  try {
    const { marketName, marketDate, stalls } = req.body;

    if (!marketName || !marketDate || !stalls || !Array.isArray(stalls) || stalls.length === 0) {
      return res.status(400).json({ message: "Market name, date, and stalls are required." });
    }

    // ✅ Ensure each stall object contains marketName
    const confirmations = stalls.map((stall) => ({
      marketName: marketName, // ✅ Add marketName explicitly
      marketDate: marketDate,
      stallName: stall.stallName,
      farmerName: stall.farmerName,
    }));

    await StallConfirmation.insertMany(confirmations);

    return res.status(201).json({ message: "Stall confirmation saved successfully." });
  } catch (error) {
    console.error("Error saving stall confirmation:", error);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};


// ✅ Fetch Stall Confirmation List (For Preview)
exports.getStallConfirmations = async (req, res) => {
  try {
    const { marketDate } = req.query;

    if (!marketDate) {
      return res.status(400).json({ message: "Market date is required." });
    }

    const confirmations = await StallConfirmation.find({ marketDate }).sort({ createdAt: -1 });

    return res.status(200).json(confirmations);
  } catch (error) {
    console.error("Error fetching stall confirmations:", error);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// ✅ Remove Stall from Preview List
exports.removeStallFromPreview = async (req, res) => {
  try {
    const { stallName, farmerName } = req.body;

    if (!stallName || !farmerName) {
      return res.status(400).json({ message: "Stall name and farmer name are required." });
    }

    const deletedStall = await StallConfirmation.findOneAndDelete({
      stallName,
      farmerName,
    });

    if (!deletedStall) {
      return res.status(404).json({ message: "Stall not found in confirmation list." });
    }

    return res.status(200).json({ message: "Stall removed successfully.", data: deletedStall });
  } catch (error) {
    console.error("Error removing stall:", error);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// ✅ Fetch Stall Confirmations by Market or Date
exports.getStallsByMarket = async (req, res) => {
  try {
    const { marketDate } = req.query;

    console.log("Received Market Date:", marketDate); // Debugging

    // Build the filter object based on query parameters
    const filter = {};
    if (marketDate) {
      filter.marketDate = new Date(marketDate); // Ensure date is correctly parsed
    }

    console.log("Filter Object:", filter); // Debugging

    // Query the database
    const confirmations = await StallConfirmation.find(filter)
      .sort({ createdAt: -1 }) // Sort by creation date (latest first)
      .exec();

    console.log("Query Results:", confirmations); // Debugging

    // Send the response
    return res.status(200).json(confirmations);
  } catch (error) {
    console.error("Error fetching stalls by market or date:", error);
    return res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

// ✅ Fetch All Stall Confirmations (Without Filtering)
exports.getAllStallConfirmations = async (req, res) => {
  try {
    // Retrieve all stall confirmations sorted by createdAt (latest first)
    const confirmations = await StallConfirmation.find().sort({ createdAt: -1 });

    // Return response
    return res.status(200).json(confirmations);
  } catch (error) {
    console.error("Error fetching all stall confirmations:", error);
    return res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};


// ✅ Preview Stall Confirmation List (New Endpoint)
exports.previewStallConfirmation = async (req, res) => {
  try {
    const { marketDate, stalls } = req.body;

    if (!marketDate || !stalls || !Array.isArray(stalls) || stalls.length === 0) {
      return res.status(400).json({ message: "Invalid request data." });
    }

    console.log("Preview Request:", { marketDate, stalls });

    // Generate preview list
    const previewList = stalls.map((stall) => ({
      stallName: stall.stallName,
      farmerName: stall.farmerName,
      marketDate: new Date(marketDate),
    }));

    return res.status(200).json({ message: "Preview generated.", previewList });
  } catch (error) {
    console.error("Error generating preview:", error);
    return res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

// ✅ Update an Existing Stall Confirmation
exports.updateStallConfirmation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.marketDate) {
      updates.marketDate = new Date(updates.marketDate);
    }

    const updatedConfirmation = await StallConfirmation.findByIdAndUpdate(
      id,
      updates,
      { new: true } // Return the updated document
    );

    if (!updatedConfirmation) {
      return res.status(404).json({ message: "Stall confirmation not found." });
    }

    return res.status(200).json({
      message: "Stall confirmation updated successfully.",
      data: updatedConfirmation,
    });
  } catch (error) {
    console.error("Error updating stall confirmation:", error);
    return res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};
