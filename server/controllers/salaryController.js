import Salary from '../model/Salary.js';
import Employee from '../model/Employee.js';

// Helper function to get month name
const getMonthName = (month) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month - 1];
};

// Helper function to validate salary data
const validateSalaryData = (data) => {
  if (!data.employee || !data.department || !data.basicSalary || !data.paymentDate) {
    return 'Required fields missing';
  }

  if (isNaN(data.basicSalary) || Number(data.basicSalary) <= 0) {
    return 'Invalid basic salary amount';
  }

  const paymentDate = new Date(data.paymentDate);
  if (isNaN(paymentDate.getTime())) {
    return 'Invalid payment date';
  }

  return null;
};

// Add salary record
export const addSalary = async (req, res) => {
  try {
    const {
      employee,
      department,
      basicSalary,
      allowances,
      deductions,
      paymentDate
    } = req.body;

    // Validate required fields
    const validationError = validateSalaryData(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    // Verify employee exists
    const employeeExists = await Employee.findById(employee);
    if (!employeeExists) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Calculate payment month and year
    const paymentDateObj = new Date(paymentDate);
    const paymentMonth = paymentDateObj.getMonth() + 1; // JavaScript months are 0-indexed
    const paymentYear = paymentDateObj.getFullYear();

    // Check if salary already exists for this month and year
    const existingSalary = await Salary.findOne({
      employee,
      month: paymentMonth,
      year: paymentYear
    });

    if (existingSalary) {
      return res.status(400).json({
        success: false,
        message: `Salary record already exists for ${employeeExists.firstName} ${employeeExists.lastName} for ${getMonthName(paymentMonth)} ${paymentYear}`
      });
    }

    // Calculate total allowances
    const totalAllowances = 
      (Number(allowances?.hra) || 0) +
      (Number(allowances?.da) || 0) +
      (Number(allowances?.medical) || 0) +
      (Number(allowances?.ta) || 0);

    // Calculate total deductions
    const totalDeductions = 
      (Number(deductions?.pf) || 0) +
      (Number(deductions?.tax) || 0) +
      (Number(deductions?.insurance) || 0);

    // Calculate net salary
    const netSalary = Number(basicSalary) + totalAllowances - totalDeductions;

    const salaryRecord = new Salary({
      employee,
      department,
      basicSalary: Number(basicSalary),
      allowances: {
        hra: Number(allowances?.hra || 0),
        da: Number(allowances?.da || 0),
        medical: Number(allowances?.medical || 0),
        ta: Number(allowances?.ta || 0),
        total: totalAllowances
      },
      deductions: {
        pf: Number(deductions?.pf || 0),
        tax: Number(deductions?.tax || 0),
        insurance: Number(deductions?.insurance || 0),
        total: totalDeductions
      },
      netSalary,
      paymentDate: paymentDateObj,
      month: paymentMonth,
      year: paymentYear,
      status: 'paid'
    });

    await salaryRecord.save();

    return res.status(201).json({
      success: true,
      message: 'Salary record created successfully',
      salary: salaryRecord
    });
  } catch (error) {
    console.error('Error adding salary:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all salary records
export const getAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find()
      .populate('employee', 'firstName lastName employeeId')
      .populate('department', 'name')
      .sort({ paymentDate: -1 });
    
    return res.status(200).json({
      success: true,
      salaries
    });
  } catch (error) {
    console.error('Error fetching salaries:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get a single salary record
export const getSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id)
      .populate('employee', 'firstName lastName employeeId')
      .populate('department', 'name');
    
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      salary
    });
  } catch (error) {
    console.error('Error fetching salary:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get salary records for an employee
export const getSalariesByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // Find employee by employeeId
    const employee = await Employee.findOne({ employeeId });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Get all salary records for this employee
    const salaries = await Salary.find({ employee: employee._id })
      .sort({ paymentDate: -1 });
    
    return res.status(200).json({
      success: true,
      employee: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        employeeId: employee.employeeId,
        department: employee.department
      },
      salaries
    });
  } catch (error) {
    console.error('Error fetching employee salaries:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update salary record
export const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      basicSalary,
      allowances,
      deductions,
      status
    } = req.body;
    
    // Find salary record
    const salary = await Salary.findById(id);
    
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      });
    }
    
    // Calculate new totals if needed
    let totalAllowances = salary.allowances.total;
    let totalDeductions = salary.deductions.total;
    let netSalary = salary.netSalary;
    
    if (basicSalary || allowances || deductions) {
      // Calculate total allowances if provided
      if (allowances) {
        totalAllowances = 
          (Number(allowances.hra) || salary.allowances.hra) +
          (Number(allowances.da) || salary.allowances.da) +
          (Number(allowances.medical) || salary.allowances.medical) +
          (Number(allowances.ta) || salary.allowances.ta);
      }
      
      // Calculate total deductions if provided
      if (deductions) {
        totalDeductions = 
          (Number(deductions.pf) || salary.deductions.pf) +
          (Number(deductions.tax) || salary.deductions.tax) +
          (Number(deductions.insurance) || salary.deductions.insurance);
      }
      
      // Calculate net salary
      netSalary = (Number(basicSalary) || salary.basicSalary) + totalAllowances - totalDeductions;
    }
    
    // Update salary record
    const updatedSalary = await Salary.findByIdAndUpdate(
      id,
      {
        basicSalary: basicSalary || salary.basicSalary,
        allowances: allowances ? {
          hra: Number(allowances.hra) || salary.allowances.hra,
          da: Number(allowances.da) || salary.allowances.da,
          medical: Number(allowances.medical) || salary.allowances.medical,
          ta: Number(allowances.ta) || salary.allowances.ta,
          total: totalAllowances
        } : salary.allowances,
        deductions: deductions ? {
          pf: Number(deductions.pf) || salary.deductions.pf,
          tax: Number(deductions.tax) || salary.deductions.tax,
          insurance: Number(deductions.insurance) || salary.deductions.insurance,
          total: totalDeductions
        } : salary.deductions,
        netSalary,
        status: status || salary.status
      },
      { new: true }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Salary record updated successfully',
      salary: updatedSalary
    });
  } catch (error) {
    console.error('Error updating salary:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update salary status
export const updateSalaryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'paid', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const salary = await Salary.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Salary status updated successfully',
      salary
    });
  } catch (error) {
    console.error('Error updating salary status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete salary record
export const deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;
    
    const salary = await Salary.findByIdAndDelete(id);
    
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Salary record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting salary:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
