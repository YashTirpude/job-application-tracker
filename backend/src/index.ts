import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import connectDB from "./config/db";
import applicationRoutes from "./routes/applicationRoutes";
import passport from "./config/passportConfig";
import authRoutes from "./routes/authRoutes";

dotenv.config();

connectDB(); // Establish the MongoDB connection

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
); // This allows all origins. You can configure it to be more restrictive if needed.

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Fallback for development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Handle preflight
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(passport.initialize());
app.use(passport.session()); // Enable persistent login
app.use("/auth", authRoutes); // Use authentication routes

app.use("/applications", applicationRoutes);
