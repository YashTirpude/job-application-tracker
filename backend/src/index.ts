import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import { connectDB } from "./config/db";
import applicationRoutes from "./routes/applicationRoutes";
import passport from "./config/passportConfig";
import authRoutes from "./routes/authRoutes";
import mongoose from "mongoose";

dotenv.config();

// Initialize database connection immediately
const dbPromise = connectDB().catch((err) => {
  console.error("Failed to connect to DB:", err);
  process.exit(1);
});

const app = express();

// Middleware setup
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://job-application-tracker-orcin.vercel.app",
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : "",
    ],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

// Session configuration with MongoDB store
const sessionConfig: session.SessionOptions = {
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60, // 14 days
    autoRemove: "interval",
    autoRemoveInterval: 60, // Minutes
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "healthy",
    dbState: mongoose.connection.readyState,
    timestamp: new Date().toISOString(),
  });
});
app.use("/auth", authRoutes);
app.use("/applications", applicationRoutes);
// Ensure DB is connected before handling routes
app.use(async (req, res, next) => {
  await dbPromise;
  next();
});

export default app;

// Local server for development
if (process.env.VERCEL_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Local server running on port ${port}`);
  });
}
