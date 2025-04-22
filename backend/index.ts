import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import connectDB from "./src/config/db";
import applicationRoutes from "./src/routes/applicationRoutes";
import passport from "./src/config/passportConfig";
import authRoutes from "./src/routes/authRoutes";

dotenv.config();

connectDB(); // Establish the MongoDB connection

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors()); // Handle preflight requests

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
      secure: true, // Force HTTPS in production
      sameSite: "none",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session()); // Enable persistent login

// Routes
app.use("/auth", authRoutes);
app.use("/applications", applicationRoutes);

export default app; // Export for Vercel
