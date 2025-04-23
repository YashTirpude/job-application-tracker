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

const app = express();

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully");

    // Middleware and routes
    app.use(express.json());
    app.use(
      cors({
        origin: "https://job-application-tracker-orcin.vercel.app",
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true,
      })
    );

    const sessionConfig = {
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: (await connectDB()).getClient(),
        collectionName: "sessions",
      }),
      cookie: {
        secure:
          process.env.VERCEL_ENV === "production" ||
          process.env.VERCEL_ENV === "preview",
        maxAge: 15 * 24 * 60 * 60 * 1000,
      },
    };

    app.use(session(sessionConfig));
    app.use(passport.initialize());
    app.use(passport.session());

    app.get("/", (req, res) => {
      res.send("Express Typescript on Vercel");
      return;
    });
    app.use("/auth", authRoutes);
    app.use("/applications", applicationRoutes);
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
};

startServer();

export { app };
