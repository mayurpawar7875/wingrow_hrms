const express = require('express');
const router = express.Router();
const gpsLocationController = require('../controllers/gpsLocationController');
const protect = require('../middleware/authMiddleware');  // Check if this is correct
const upload = require('../middleware/upload');

console.log("🔍 Checking protect middleware:", typeof protect);  // Debug log

router.post(
  '/upload-gps-selfie',
  (req, res, next) => { 
    console.log("🛡️ Protect middleware triggered"); 
    next();
  }, 
  upload.single('selfie'),
  (req, res, next) => {
    console.log("📸 File upload middleware triggered"); 
    next();
  },
  gpsLocationController.uploadGPSWithSelfie
);

module.exports = router;
