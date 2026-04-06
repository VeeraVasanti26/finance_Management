import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-dashboard',
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_12345',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};
