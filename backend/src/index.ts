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
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // This allows all origins. You can configure it to be more restrictive if needed.

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 1-day session
  })
);

app.use(passport.initialize());
app.use(passport.session()); // Enable persistent login
app.use("/auth", authRoutes); // Use authentication routes

app.use("/applications", applicationRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
