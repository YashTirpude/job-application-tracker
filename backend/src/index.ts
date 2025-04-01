import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
dotenv.config();

connectDB(); // Establish the MongoDB connection

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // This allows all origins. You can configure it to be more restrictive if needed.
app.use(express.json());

// const mockApplications = [
//   {
//     id: 1,
//     jobTitle: "Software Engineer",
//     company: "Tech Corp",
//     description: "Develop and maintain web applications.",
//     dateApplied: "2024-03-15",
//     status: "Pending",
//   },
//   {
//     id: 2,
//     jobTitle: "Product Manager",
//     company: "Innovate Ltd.",
//     description: "Lead a team to build innovative products.",
//     dateApplied: "2024-03-10",
//     status: "Interview Scheduled",
//   },
// ];

// Test route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

// app.get("/applications", (req, res) => {
//   res.status(200).json(mockApplications);
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
