import express from 'express';
import verifyUser from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.use(verifyUser);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

export default router;
