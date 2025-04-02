import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import applicationRoutes from "./routes/applicationRoutes";
dotenv.config();

connectDB(); // Establish the MongoDB connection

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // This allows all origins. You can configure it to be more restrictive if needed.
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.use("/api/applications", applicationRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
