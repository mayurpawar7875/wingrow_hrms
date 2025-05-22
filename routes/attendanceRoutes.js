const express = require('express');
const router = express.Router();
const { validateGPS } = require('../controllers/attendanceController');
const { uploadGPSLocation } = require('../controllers/attendanceController');
const { getAttendanceHistory } = require('../controllers/attendanceController');


const { protect } = require('../middleware/authMiddleware');

// POST API to validate GPS
// router.post('/validate-gps', validateGPS);

// router.post('/gps/upload', uploadGPSLocation);

// Route for fetching attendance history
router.get('/history', getAttendanceHistory);

module.exports = router;

