import Attendance from '../model/Attendance.js';
import Employee from '../model/Employee.js';

export const saveAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;
    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Date and records are required' });
    }

    // Remove existing attendance for the date
    await Attendance.findOneAndDelete({ date });

    // Save new attendance
    const attendance = new Attendance({ date, records });
    await attendance.save();

    return res.status(201).json({ success: true, message: 'Attendance saved successfully' });
  } catch (error) {
    console.error('Error saving attendance:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }
    const attendance = await Attendance.findOne({ date }).populate('records.employee', 'employeeId firstName lastName department');
    return res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    // Aggregate attendance by date
    const report = await Attendance.aggregate([
      {
        $project: {
          date: 1,
          present: {
            $size: {
              $filter: {
                input: "$records",
                as: "rec",
                cond: { $eq: ["$$rec.status", "present"] }
              }
            }
          },
          absent: {
            $size: {
              $filter: {
                input: "$records",
                as: "rec",
                cond: { $eq: ["$$rec.status", "absent"] }
              }
            }
          }
        }
      },
      { $sort: { date: 1 } }
    ]);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getEmployeeAttendance = async (req, res) => {
  try {
    const { month } = req.query; // YYYY-MM format
    const employeeId = req.user._id;

    if (!month) {
      return res.status(400).json({
        success: false,
        message: 'Month parameter is required (YYYY-MM format)'
      });
    }

    // Parse year and month
    const [year, monthNum] = month.split('-');
    // Create date range for the month
    const startDate = `${year}-${monthNum}-01`;
    const endDate = `${year}-${monthNum}-31`; // This will work for all months

    // Find attendance records for the employee in the given month
    const attendanceRecords = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
      'records.employee': employeeId
    }).sort({ date: 1 });

    // Format the response
    const attendance = attendanceRecords.map(record => {
      const employeeRecord = record.records.find(
        rec => rec.employee.toString() === employeeId.toString()
      );
      return {
        _id: record._id,
        date: record.date,
        status: employeeRecord ? employeeRecord.status : 'absent'
      };
    });

    // Calculate statistics
    const totalDays = attendance.length;
    const presentDays = attendance.filter(record => record.status === 'present').length;
    const absentDays = totalDays - presentDays;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    return res.status(200).json({
      success: true,
      attendance,
      stats: {
        totalDays,
        presentDays,
        absentDays,
        attendancePercentage
      }
    });

  } catch (error) {
    console.error('Error in getEmployeeAttendance:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
