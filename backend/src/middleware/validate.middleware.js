import { validationResult } from 'express-validator';
import apiResponse from '../utils/apiResponse.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation Error', 400, errors.array());
  }
  next();
};

export default validate;
