import express from 'express';
import verifyUser from '../middleware/authMiddleware.js';
import {
  getEmployeeLeaves,
  addLeave,
  getAllLeaves,
  updateLeaveStatus
} from '../controllers/leaveController.js';

const router = express.Router();

// Employee routes
router.get('/employee-leaves', verifyUser, getEmployeeLeaves);
router.post('/add', verifyUser, addLeave);

// Admin routes
router.get('/all', verifyUser, getAllLeaves);
router.patch('/:leaveId', verifyUser, updateLeaveStatus);

export default router;
