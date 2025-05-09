const Attendance = require('../models/Attendance');
const Action = require('../models/Action');
exports.getDashboardReport = async (req, res) => {
  try {
    // Date range for today
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    // Total attendance count for today
    const totalAttendance = await Attendance.countDocuments({
      markedAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Action summary (group by action type)
    const actionsSummary = await Action.aggregate([
      { $match: { completedAt: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: '$action', count: { $sum: 1 } } },
    ]);

    // GPS validations (if needed)
    const gpsValidations = await Attendance.find({
      markedAt: { $gte: startOfDay, $lte: endOfDay },
    }).select('gpsLocation location markedAt');

    // Daily trends (attendance over the last 7 days)
    const dailyTrends = await Attendance.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$markedAt' },
            month: { $month: '$markedAt' },
            year: { $year: '$markedAt' },
          },
          attendanceCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Respond with a structured report
    res.status(200).json({
      success: true,
      data: {
        totalAttendance,
        actionsSummary,
        gpsValidations,
        dailyTrends,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};