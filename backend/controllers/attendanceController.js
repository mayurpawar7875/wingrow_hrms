const Attendance = require('../models/Attendance');

const Action = require('../models/Action');
const StallConfirmation = require('../models/StallConfirmation');

// Utility function to record an action
const recordAction = async (userId, actionType) => {
  try {
    return await Action.create({
      userId,
      action: actionType,
      completedAt: new Date(),
    });
  } catch (error) {
    console.error(`Error recording action: ${error.message}`);
    throw error;
  }
};

// Haversine distance calculation
const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const lat1 = coords1.latitude;
  const lon1 = coords1.longitude;
  const lat2 = coords2.latitude;
  const lon2 = coords2.longitude;

  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// @desc    Mark attendance for a market organizer
// @route   POST /api/attendance/mark
// @access  Private
exports.markAttendance = async (req, res, next) => {
  const { location, selfie, gpsLocation } = req.body;

  try {
    // Validate required fields
    if (!location || !selfie || !gpsLocation || !gpsLocation.latitude || !gpsLocation.longitude) {
      return res.status(400).json({ message: 'Location, selfie, and GPS coordinates are required' });
    }

    // Market GPS coordinates (replace with your actual market's location)
    const marketLocation = {
      latitude: 19.0760,
      longitude: 72.8777,
    };

    // Allowed distance (in kilometers)
    const allowedDistance = process.env.ALLOWED_DISTANCE || 1; // Default to 1 km

    // Calculate distance
    const distance = haversineDistance(gpsLocation, marketLocation);

    // Check if GPS location is within the allowed range
    if (distance > allowedDistance) {
      return res.status(400).json({
        message: `Location is outside the allowed range (${distance.toFixed(2)} km).`,
      });
    }

    // Check if attendance is already marked for today
    const existingAttendance = await Attendance.findOne({
      user: req.user.id,
      markedAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    // Create a new attendance record
    const attendance = new Attendance({
      user: req.user.id,
      location,
      selfie,
      gpsLocation,
      markedAt: new Date(),
    });

    await attendance.save();

    // Record the action for marking attendance
    const action = await recordAction(req.user.id, 'mark_attendance');

    // Respond with success
    res.status(201).json({
      success: true,
      attendance,
      action,
    });
  } catch (error) {
    next(error); // Pass the error to the centralized error handler
  }
};

// @desc    Validate GPS Coordinates
// @route   POST /api/attendance/validate-gps
// @access  Public
exports.validateGPS = async (req, res) => {
  const { latitude, longitude } = req.body;

  // Market GPS coordinates (replace with your actual market's location)
  const marketLocation = {
    latitude: 19.0760,
    longitude: 72.8777,
  };

  // Allowed distance (in kilometers)
  const allowedDistance = process.env.ALLOWED_DISTANCE || 1; // Default to 1 km

  try {
    // Validate required fields
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Calculate distance
    const distance = haversineDistance(
      { latitude, longitude },
      marketLocation
    );

    // Validate the distance
    if (distance <= allowedDistance) {
      return res.status(200).json({
        valid: true,
        message: `Location is within the allowed range (${distance.toFixed(2)} km).`,
      });
    } else {
      return res.status(400).json({
        valid: false,
        message: `Location is outside the allowed range (${distance.toFixed(2)} km).`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getAttendanceHistory = async (req, res) => {
  try {
    console.log(Attendance); // Debugging step to check the model
    const attendanceHistory = await Attendance.find()
      .populate('user', 'name email')
      .sort({ markedAt: -1 });

    res.status(200).json(attendanceHistory);
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ message: 'Failed to fetch attendance history' });
  }
};


exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.status = 'read';
    notification.readAt = new Date();

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Controller for uploading GPS location
exports.uploadGPSLocation = async (req, res) => {
  const { userId, latitude, longitude } = req.body;

  try {
    if (!userId || !latitude || !longitude) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save the GPS location (implement your own logic to save this data)
    console.log(`Received GPS data: UserId=${userId}, Lat=${latitude}, Long=${longitude}`);

    res.status(201).json({
      success: true,
      message: 'GPS location uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading GPS location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveStallConfirmation = async (req, res) => {
  const { marketName, marketDate, organizerId, stallName, farmerName } = req.body;

  try {
    if (!marketName || !marketDate ||!organizerId|| !stallName || !farmerName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const stallConfirmation = new StallConfirmation({
      marketName,
      marketDate,
      organizerId: req.user.id,
      stallName,
      farmerName,
    });

    await stallConfirmation.save();

    res.status(201).json({
      success: true,
      message: 'Stall confirmation saved successfully!',
      data: stallConfirmation,
    });
  } catch (error) {
    console.error('Error saving stall confirmation:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

