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
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // True in production, false locally
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session()); // Enable persistent login

// Routes
app.use("/auth", authRoutes);
app.use("/applications", applicationRoutes);

// Local development server
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app; // Export for Vercel
