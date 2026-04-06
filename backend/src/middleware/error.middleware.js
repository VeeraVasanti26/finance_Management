import apiResponse from '../utils/apiResponse.js';

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  apiResponse.error(res, err.message || 'Server Error', err.statusCode || 500);
};

export default errorHandler;
