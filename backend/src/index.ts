import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
