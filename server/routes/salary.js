import express from 'express';
import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

// Import the salary controllers
// If you don't have these controllers yet, we'll create placeholder functions
import {
  addSalary,
  getAllSalaries,
  getSalary,
  getSalariesByEmployee,
  updateSalary,
  deleteSalary
} from '../controllers/salaryController.js';

// Use verifyUser middleware for all salary routes
router.use(verifyUser);

// Define salary routes
router.post('/', addSalary);
router.get('/', getAllSalaries);
router.get('/:id', getSalary);
router.get('/employee/:employeeId', getSalariesByEmployee);
router.put('/:id', updateSalary);
router.delete('/:id', deleteSalary);

export default router;
