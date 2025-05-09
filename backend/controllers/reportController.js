const Attendance = require('../models/Attendance');
const Action = require('../models/Action');

// Helper to parse dates
const parseDateRange = (date) => {
  const startOfDay = new Date(date).setHours(0, 0, 0, 0);
  const endOfDay = new Date(date).setHours(23, 59, 59, 999);
  return { $gte: startOfDay, $lte: endOfDay };
};

// Fetch attendance report
exports.getAttendanceReport = async (req, res) => {
  const { date, userId } = req.query;

  try {
    const filter = {};
    if (date) {
      filter.markedAt = parseDateRange(date);
    }
    if (userId) {
      filter.user = userId;
    }

    const attendance = await Attendance.find(filter).populate('user', 'username role');
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch actions report
exports.getActionsReport = async (req, res) => {
  const { date, userId } = req.query;

  try {
    const filter = {};
    if (date) {
      filter.completedAt = parseDateRange(date);
    }
    if (userId) {
      filter.employeeId = userId;
    }

    const actions = await Action.find(filter).populate('employeeId', 'username role');
    res.status(200).json({ success: true, data: actions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch GPS validations report (if stored in a separate model or combined with Attendance)
exports.getGPSReport = async (req, res) => {
  const { date, userId } = req.query;

  try {
    const filter = {};
    if (date) {
      filter.markedAt = parseDateRange(date); // Assuming GPS data is logged with attendance
    }
    if (userId) {
      filter.user = userId;
    }

    const gpsValidations = await Attendance.find(filter).select('gpsLocation user markedAt').populate('user', 'username role');
    res.status(200).json({ success: true, data: gpsValidations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// reportController.js
exports.generateDailyReport = async (req, res) => {
    try {
      // Add logic for generating daily report
      res.status(200).json({ success: true, message: 'Daily report generated successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  exports.getReports = async (req, res) => {
    const { userId, date } = req.query;
  
    try {
      const query = {};
  
      if (userId) {
        query.userId = userId;
      }
  
      if (date) {
        const reportDate = new Date(date);
        reportDate.setHours(0, 0, 0, 0);
        query.date = reportDate;
      }
  
      const reports = await Report.find(query).populate('userId', 'username role');
  
      res.status(200).json({ success: true, reports });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
