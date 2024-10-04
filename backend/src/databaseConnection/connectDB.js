import mongoose from "mongoose";

const dbConnection = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; // Connection is already open.
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

export default dbConnection