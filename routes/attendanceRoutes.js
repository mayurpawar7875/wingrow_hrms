const express = require('express');
const router = express.Router();
// const { markAttendance } = require('../controllers/attendanceController');
const { validateGPS } = require('../controllers/attendanceController');
const { uploadGPSLocation } = require('../controllers/attendanceController');
// const { saveStallConfirmation } = require('../controllers/attendanceController');
const { getAttendanceHistory } = require('../controllers/attendanceController');


const { protect } = require('../middleware/authMiddleware');

// router.post('/mark', protect, markAttendance);
// router.post('/upload', uploadGPSLocation);
// POST API to validate GPS
router.post('/validate-gps', validateGPS);

router.post('/gps/upload', uploadGPSLocation);
// router.post('/confirmation', protect, saveStallConfirmation);


// Route for fetching attendance history
router.get('/history', getAttendanceHistory);







module.exports = router;

