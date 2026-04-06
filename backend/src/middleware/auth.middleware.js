import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { env } from '../config/env.js';
import apiResponse from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return apiResponse.error(res, 'Not authorized to access this route', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return apiResponse.error(res, 'User not found', 404);
    }
    next();
  } catch (err) {
    return apiResponse.error(res, 'Not authorized to access this route', 401);
  }
};
