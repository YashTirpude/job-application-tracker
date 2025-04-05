import mongoose, { Schema, Document } from "mongoose";

// Interface for Application Document
interface IJobApplication extends Document {
  jobTitle: string;
  company: string;
  description: string;
  dateApplied: string;
  status: string;
  jobPlatform: string;
  jobUrl: string;
  resumeUrl?: string; // This field is optional for now
  user: mongoose.Types.ObjectId;
}

// Define the JobApplication schema
const jobApplicationSchema: Schema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dateApplied: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    jobPlatform: {
      type: String, // Platform like LinkedIn, Indeed, etc.
      required: true,
    },
    jobUrl: {
      type: String, // The URL of the job listing
      required: true,
    },
    resumeUrl: {
      type: String, // URL of the uploaded resume (stored in cloud storage)
      required: false, // Not required initially
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ✅ This links each app to a specific user
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const JobApplication = mongoose.model<IJobApplication>(
  "JobApplication",
  jobApplicationSchema
);

export default JobApplication;
