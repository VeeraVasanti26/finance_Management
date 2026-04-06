import authService from '../services/auth.service.js';
import apiResponse from '../utils/apiResponse.js';

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    apiResponse.success(res, user, 'User registered successfully', 201);
  } catch (err) {
    apiResponse.error(res, err.message, 400);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    apiResponse.success(res, user, 'User logged in successfully');
  } catch (err) {
    apiResponse.error(res, err.message, 401);
  }
};

const getMe = async (req, res) => {
  apiResponse.success(res, req.user);
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Use the origin from the request or a default for the reset link
    const host = req.get('origin') || `${req.protocol}://${req.get('host')}`;
    await authService.forgotPassword(email, host);
    apiResponse.success(res, null, 'Email sent');
  } catch (err) {
    apiResponse.error(res, err.message, 400);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    const user = await authService.resetPassword(token, password);
    apiResponse.success(res, user, 'Password reset successfully');
  } catch (err) {
    apiResponse.error(res, err.message, 400);
  }
};

export default { register, login, getMe, forgotPassword, resetPassword };
