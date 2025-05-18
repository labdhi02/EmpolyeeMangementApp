import express from 'express';
import verifyUser from '../middleware/authMiddleware.js';
import { 
  addSalary,
  getAllSalaries,
  getSalary,
  getSalariesByEmployee,
  updateSalary,
  deleteSalary,
  updateSalaryStatus,
} from '../controllers/salaryController.js';

const router = express.Router();

// All routes are protected by verifyUser middleware and have complete CRUD operations
router.use(verifyUser);

router.post('/', addSalary);
router.get('/', getAllSalaries);
router.get('/:id', getSalary);
router.get('/employee/:employeeId', getSalariesByEmployee);
router.put('/:id', updateSalary);
router.patch('/:id/status', updateSalaryStatus);
router.delete('/:id', deleteSalary);

export default router;
