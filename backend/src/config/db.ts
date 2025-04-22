import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 5000, // Fail fast if no connection
      maxPoolSize: 10, // Limit connections
      socketTimeoutMS: 45000, // Close idle connections
    });
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
