import express from 'express';
import { signupUser, loginUser, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;
