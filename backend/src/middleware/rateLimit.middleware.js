import rateLimit from 'express-rate-limit';
import apiResponse from '../utils/apiResponse.js';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  validate: { trustProxy: false },
  handler: (req, res) => {
    apiResponse.error(res, 'Too many requests from this IP, please try again after 15 minutes', 429);
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login/register attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  handler: (req, res) => {
    apiResponse.error(res, 'Too many authentication attempts, please try again after an hour', 429);
  },
});

export const recordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 record operations per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  handler: (req, res) => {
    apiResponse.error(res, 'Too many record operations, please slow down', 429);
  },
});
