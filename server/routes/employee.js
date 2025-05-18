import express from 'express';
import verifyUser from '../middleware/authMiddleware.js';
import { 
  addEmployee, 
  getAllEmployees, 
  getEmployee, 
  updateEmployee, 
  deleteEmployee 
} from '../controllers/employeeController.js';

const router = express.Router();

router.post('/', verifyUser, addEmployee);
router.get('/', verifyUser, getAllEmployees);
router.get('/:id', verifyUser, getEmployee);
router.put('/:id', verifyUser, updateEmployee);
router.delete('/:id', verifyUser, deleteEmployee);

export default router;
