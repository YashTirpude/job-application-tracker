import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let cachedConnection: mongoose.Connection | null = null;

const atlasOptions: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 3000, // Reduce from 5000
  connectTimeoutMS: 5000, // Reduce from 10000
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
  writeConcern: { w: "majority" },
  autoIndex: false,
};

const connectDB = async (): Promise<mongoose.Connection> => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI as string, atlasOptions);
    cachedConnection = mongoose.connection;

    cachedConnection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      cachedConnection = null;
    });

    cachedConnection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      cachedConnection = null;
    });

    return cachedConnection;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

const closeDB = async (): Promise<void> => {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
  }
};

export { connectDB, closeDB };
