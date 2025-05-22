const express = require('express');
const router = express.Router();
const gpsLocationController = require('../controllers/gpsLocationController');
const protect = require('../middleware/authMiddleware'); // ✅ Make sure this is correct
const upload = require('../middleware/upload');

// ✅ Final working route
router.post(
  '/upload-gps-selfie',
  protect,                          // ✅ This applies the token verification middleware
  upload.single('selfie'),          // ✅ This handles the selfie file
  gpsLocationController.uploadGPSWithSelfie // ✅ This saves the data to DB
);

module.exports = router;
