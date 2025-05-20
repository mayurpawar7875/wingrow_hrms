const express = require("express");
const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
const stallsController = require("../controllers/stallsController");

// ✅ Stall Confirmation Routes
// ✅ Route to Submit Stall Confirmation List (Fixed: Removed `protect`)
router.post("/submit-confirmation", stallsController.submitStallConfirmation);

// ✅ Route to Fetch Stall Confirmation List (For Preview) (Fixed: Removed `protect`)
// router.get("/preview-confirmation", stallsController.getStallConfirmations);

// ✅ Route to Remove a Stall from Preview List
router.post("/remove-stall", stallsController.removeStallFromPreview);

// ✅ Fetch Stall Confirmations by Market
router.get("/confirmations", stallsController.getStallConfirmations);
router.get("/stalls-by-market", stallsController.getStallsByMarket);
// ✅ Route to Fetch All Stall Confirmations (Without Filtering)
router.get("/all-confirmations",  stallsController.getAllStallConfirmations);


// ✅ FIXED: Route to Preview Stall Confirmation List (Changed `post` → `get`)
router.get("/preview-confirmation", stallsController.previewStallConfirmation);

// ✅ Update & Delete Stall Confirmation
router.put("/update-confirmation/:id",  stallsController.updateStallConfirmation);
// router.delete("/delete-confirmation/:id", protect, stallsController.deleteStallConfirmation);

module.exports = router;
