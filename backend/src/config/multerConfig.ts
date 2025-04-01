import multer from "multer";
import path from "path";

// Allowed file types
const allowedFileTypes = /jpeg|jpg|png|pdf|doc|docx/;

// Multer Storage (Temporarily Store Files Before Uploading to Cloudinary)
const storage = multer.memoryStorage();

// Multer Upload Middleware
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only images, PDFs, and Word documents are allowed."
        )
      );
    }
  },
});

export default upload;
