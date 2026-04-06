import mongoose from 'mongoose';
import User from '../models/user.model.js';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-dashboard';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed initial admin if no users exist
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        await User.create({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
          status: 'active'
        });
        console.log('Initial admin user created: admin@example.com / admin123');
      }
    } catch (seedError) {
      console.error('Error seeding database:', seedError.message);
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Backend is running but MongoDB is unavailable. Please ensure MongoDB is running locally or provide a valid MONGODB_URI in .env');
  }
};

export default connectDB;
