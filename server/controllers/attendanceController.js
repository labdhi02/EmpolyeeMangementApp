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
