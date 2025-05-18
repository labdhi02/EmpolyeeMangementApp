import bcrypt from 'bcrypt';
import Employee from '../model/Employee.js';
import Department from '../model/Department.js';

const addEmployee = async (req, res) => {
  try {
    const { 
      employeeId, 
      firstName, 
      lastName, 
      email, 
      gender, 
      dateOfBirth, 
      salary, 
      department, 
      designation,
      password 
    } = req.body;

    // Validate required fields
    if (!employeeId || !firstName || !lastName || !email || !gender || 
        !dateOfBirth || !salary || !department || !designation || !password) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ 
      $or: [{ employeeId }, { email }] 
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this ID or email already exists'
      });
    }

    // Verify department exists
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department selected'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new employee with hashed password
    const employee = new Employee({
      employeeId,
      firstName,
      lastName,
      email,
      gender,
      dateOfBirth,
      salary,
      department,
      designation,
      password: hashedPassword
    });

    await employee.save();

    const populatedEmployee = await Employee.findById(employee._id)
      .populate('department', 'name');

    return res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      employee: populatedEmployee
    });

  } catch (error) {
    console.error('Error adding employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('department', 'name')
      .select('-__v')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department')
      .select('-password -__v')
      .lean();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    return res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch employee details'
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { 
      employeeId, 
      firstName, 
      lastName, 
      email, 
      gender, 
      dateOfBirth, 
      salary, 
      department, 
      designation 
    } = req.body;

    // Check if employee exists except current employee
    const existingEmployee = await Employee.findOne({
      _id: { $ne: req.params.id },
      $or: [{ employeeId }, { email }]
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this ID or email already exists'
      });
    }

    if (department) {
      const departmentExists = await Department.findById(department);
      if (!departmentExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid department selected'
        });
      }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('department', 'name');

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export { 
  addEmployee, 
  getAllEmployees, 
  getEmployee, 
  updateEmployee, 
  deleteEmployee 
};