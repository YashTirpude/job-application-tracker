import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// MongoDB connection function

const connectDB = async () => {
  try {
    // Connect to MongoDB using the Mongoose library'
    const connect = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`); // Log the error if connection fails
    process.exit(1); // Exit the process if there's an error connecting to MongoDB
  }
};

// Export the MongoDB connection function
export default connectDB;
