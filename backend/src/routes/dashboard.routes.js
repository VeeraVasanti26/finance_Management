import express from 'express';
import dashboardController from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import dbCheck from '../middleware/dbCheck.middleware.js';

const router = express.Router();

router.use(protect);
router.use(dbCheck);
router.get('/summary', authorize('viewer', 'analyst', 'admin'), dashboardController.getSummary);

export default router;
