import express from "express";

import { authenticateJWT } from "../middleware/authMiddleware";
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post("/", authenticateJWT, upload.single("resume"), createApplication);
router.get("/", authenticateJWT, getAllApplications);
router.get("/:id", authenticateJWT, getApplicationById);
router.put("/:id", authenticateJWT, upload.single("resume"), updateApplication);
router.delete("/:id", authenticateJWT, deleteApplication);

export default router;
