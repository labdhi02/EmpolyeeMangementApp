import express from 'express';
import verifyUser from '../middleware/authMiddleware.js';
import { saveAttendance, getAttendanceByDate, getAttendanceReport, getEmployeeAttendance } from '../controllers/attendanceController.js';

const router = express.Router();

router.use(verifyUser);
router.post('/', saveAttendance);
router.get('/', getAttendanceByDate);
router.get('/report', getAttendanceReport);
router.get('/employee', verifyUser, getEmployeeAttendance);

export default router;
