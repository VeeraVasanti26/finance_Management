import mongoose from 'mongoose';
import apiResponse from '../utils/apiResponse.js';

const dbCheck = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return apiResponse.error(
      res, 
      'Database connection is not established. If you are running this in the preview, you must provide a MONGODB_URI in the Secrets panel. If running locally, ensure MongoDB is started.', 
      503
    );
  }
  next();
};

export default dbCheck;
