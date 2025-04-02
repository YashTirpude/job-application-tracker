import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "job-applications/resumes", // Cloudinary folder
      format: file.mimetype.split("/")[1], // Automatically set format
      resource_type: "auto", // Detects file type automatically
    };
  },
});

const upload = multer({ storage });

export default upload;
