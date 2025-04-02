import express from "express";
import upload from "../config/multerConfig";

import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController";

const router = express.Router();

// Routes for job applications
router.post("/", upload.single("resume"), createApplication); // Create application with resume upload
router.get("/", getAllApplications); // Get all applications
router.get("/:id", getApplicationById); // Get application by ID
router.put("/:id", updateApplication); // Update application
router.delete("/:id", deleteApplication); // Delete application

export default router;
