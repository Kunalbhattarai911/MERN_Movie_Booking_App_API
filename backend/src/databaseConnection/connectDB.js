import mongoose from "mongoose";

let isConnected; // track the connection status

const dbConnection = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Successfully connected to the database");
  } catch (error) {
    isConnected = false;
    console.error("Database connection error:", error);
  }
};

export default dbConnection;
