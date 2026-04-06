import express from 'express';
import recordController from '../controllers/record.controller.js';
import { recordValidator } from '../validators/record.validator.js';
import validate from '../middleware/validate.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import dbCheck from '../middleware/dbCheck.middleware.js';
import { recordLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.use(protect);
router.use(dbCheck);
router.use(recordLimiter);

router.get('/', authorize('viewer', 'analyst', 'admin'), recordController.getAllRecords);
router.get('/:id', authorize('viewer', 'analyst', 'admin'), recordController.getRecordById);
router.post('/', authorize('admin'), recordValidator, validate, recordController.createRecord);
router.put('/:id', authorize('admin'), recordValidator, validate, recordController.updateRecord);
router.delete('/:id', authorize('admin'), recordController.deleteRecord);

export default router;
