import express from 'express';
import verifyUser from '../middleware/authMiddleware.js';
import Employee from '../model/Employee.js';
import { 
  addEmployee, 
  getAllEmployees, 
  getEmployee, 
  updateEmployee, 
  deleteEmployee 
} from '../controllers/employeeController.js';

const router = express.Router();

// Important: Place the profile route BEFORE the :id route
router.get('/profile', verifyUser, async (req, res) => {
  try {
    const employee = await Employee.findById(req.user._id)
      .populate('department', 'name')
      .select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add all routes
router.post('/', verifyUser, addEmployee);
router.get('/', verifyUser, getAllEmployees);
router.get('/:id', verifyUser, getEmployee);
router.put('/:id', verifyUser, updateEmployee);
router.delete('/:id', verifyUser, deleteEmployee);

router.get('/department/:departmentId', verifyUser, async (req, res) => {
  try {
    const employees = await Employee.find({ department: req.params.departmentId })
      .select('firstName lastName')
      .sort({ firstName: 1 });

    if (!employees) {
      return res.status(404).json({
        success: false,
        message: 'No employees found for this department'
      });
    }

    return res.status(200).json({
      success: true,
      employees
    });
  } catch (error) {
    console.error('Error fetching employees by department:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching employees'
    });
  }
});

export default router;
