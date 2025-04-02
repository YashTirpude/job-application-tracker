import express, { Request, Response, RequestHandler } from "express";
import upload from "../config/multerConfig";

const router = express.Router();

// POST /upload-resume - Upload resume to Cloudinary
const uploadResume: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Cloudinary automatically uploads the file, and Multer provides the URL
    const fileUrl = (req.file as any).path; // Cloudinary stores the file path in `req.file.path`

    res.status(200).json({ message: "Resume uploaded successfully", fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error while uploading resume" });
  }
};

// Apply the handler to the route
router.post("/upload-resume", upload.single("resume"), uploadResume);

export default router;
