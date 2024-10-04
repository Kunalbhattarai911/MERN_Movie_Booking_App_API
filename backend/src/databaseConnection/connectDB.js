import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully Connected To Database');
  } catch (error) {
    console.error("Error Details:", error);
    throw new Error("Error while connecting to database: " + error.message);
  }
};

export default dbConnection;
