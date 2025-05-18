import Employee from '../model/Employee.js';
import Department from '../model/Department.js';
import Leave from '../model/Leave.js';
import Salary from '../model/Salary.js';

export const getDashboardSummary = async (req, res) => {
  try {
    // Get employee count
    const employeeCount = await Employee.countDocuments();

    // Calculate total payroll from salary records (paid only)
    const payrollAgg = await Salary.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: "$netSalary" } } }
    ]);
    const totalPayroll = payrollAgg && payrollAgg.length > 0 && payrollAgg[0].total ? payrollAgg[0].total : 0;

    // Get department count
    const departmentCount = await Department.countDocuments();

    // Get leave statistics
    const leaves = await Leave.find();
    const leaveStats = {
      total: Array.isArray(leaves) ? leaves.length : 0,
      approved: Array.isArray(leaves) ? leaves.filter(leave => leave.status === 'approved').length : 0,
      pending: Array.isArray(leaves) ? leaves.filter(leave => leave.status === 'pending').length : 0,
      rejected: Array.isArray(leaves) ? leaves.filter(leave => leave.status === 'rejected').length : 0
    };

    // Return summary data (always as valid JSON)
    res.status(200).json({
      success: true,
      data: {
        employeeCount: employeeCount || 0,
        departmentCount: departmentCount || 0,
        totalPayroll: totalPayroll || 0,
        leaveStats: leaveStats
      }
    });

  } catch (error) {
    console.error('Error in getDashboardSummary:', error);
    res.status(500).json({
      success: false,
      message: error && error.message ? error.message : 'Internal server error'
    });
  }
};
