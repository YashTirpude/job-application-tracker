import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import { connectDB } from "./config/db";
import applicationRoutes from "./routes/applicationRoutes";
import passport from "./config/passportConfig";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();
    // Rest of your server setup...
  } catch (error) {
    console.error("Failed to initialize server:", error);
  }
}; // Establish the MongoDB connection
startServer();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://job-application-tracker-orcin.vercel.app",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
); // This allows all origins. You can configure it to be more restrictive if needed.

const sessionConfig = {
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session()); // Enable persistent login

app.get("/", (req, res) => {
  res.send("Express Typescript on Vercel");
  return;
});
app.use("/auth", authRoutes); // Use authentication routes

app.use("/applications", applicationRoutes);

export { app };

if (process.env.VERCEL_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
