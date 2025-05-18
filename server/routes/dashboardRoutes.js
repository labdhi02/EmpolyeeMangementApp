import express from 'express';
import verifyUser from '../middleware/authMiddleware.js';
import { getDashboardSummary } from '../controllers/dashboardController.js';

const router = express.Router();

router.use(verifyUser);
router.get('/summary', getDashboardSummary);

export default router;
