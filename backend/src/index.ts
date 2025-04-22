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
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
console.log("CORS middleware applied");

app.options("*", cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),

    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session()); // Enable persistent login
app.use("/auth", authRoutes);
console.log(
  "Auth routes registered:",
  authRoutes.stack.map((r) => r.route?.path).filter(Boolean)
);

app.use("/applications", applicationRoutes);
console.log(
  "Application routes registered:",
  applicationRoutes.stack.map((r) => r.route?.path).filter(Boolean)
);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app; // Export for Vercel
