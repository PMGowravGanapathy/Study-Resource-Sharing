import express from 'express';
import { getStats, getUsers, getAdminResources } from '../controllers/admin.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getStats);
router.get('/users', protect, admin, getUsers);
router.get('/resources', protect, admin, getAdminResources);

export default router;
