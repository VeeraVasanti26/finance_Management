import express from 'express';
import authController from '../controllers/auth.controller.js';
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from '../validators/auth.validator.js';
import validate from '../middleware/validate.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import dbCheck from '../middleware/dbCheck.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.post('/register', authLimiter, dbCheck, registerValidator, validate, authController.register);
router.post('/login', authLimiter, dbCheck, loginValidator, validate, authController.login);
router.post('/forgotpassword', authLimiter, dbCheck, forgotPasswordValidator, validate, authController.forgotPassword);
router.put('/resetpassword/:token', authLimiter, dbCheck, resetPasswordValidator, validate, authController.resetPassword);
router.get('/me', protect, authController.getMe);

export default router;
