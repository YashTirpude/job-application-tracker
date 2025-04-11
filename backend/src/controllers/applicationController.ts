import { Response } from "express";
import JobApplication from "../models/Application";
import { AuthRequest } from "../middleware/authMiddleware";
import fs from "fs";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://lnqqfhuvmniktlcnhcnx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucXFmaHV2bW5pa3RsY25oY254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjk2MjAsImV4cCI6MjA1OTk0NTYyMH0.uH--KOc5iAKwAsQfA_Rc4ZpLw6OC7mxN_cLrZL3HWWs"
);

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const applicationData = { ...req.body, user: req.user._id };

    if (req.file) {
      const fileExt =
        req.file.originalname.split(".").pop()?.toLowerCase() || "pdf";
      const fileName = `${req.user._id}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("resumes")
        .upload(fileName, req.file.buffer, {
          contentType: `application/${fileExt}`,
        });

      if (error) throw new Error("Supabase upload failed: " + error.message);

      applicationData.resumeUrl = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName).data.publicUrl;
    }

    const application = new JobApplication(applicationData);
    await application.save();

    res.status(201).json(application);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { status, jobPlatform, search, sortBy, order } = req.query;

    const query: any = { user: req.user._id };

    // 🔍 Search
    if (search) {
      query.$or = [
        { jobTitle: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { jobPlatform: { $regex: search, $options: "i" } },
      ];
    }

    // 🗂️ Filter
    if (status) query.status = status;
    if (jobPlatform) query.jobPlatform = jobPlatform;

    // 🔃 Sort
    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy as string] = order === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default: newest first
    }

    const applications = await JobApplication.find(query).sort(sortOptions);
    console.log("Query:", query);

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingApp = await JobApplication.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!existingApp) {
      res
        .status(404)
        .json({ message: "Application not found or unauthorized" });
      return;
    }

    const resumeUrl = req.file ? req.file.path : existingApp.resumeUrl;

    const updatedFields = {
      ...req.body,
      resumeUrl,
    };

    const updatedApp = await JobApplication.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true,
      }
    );

    res.status(200).json(updatedApp);
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!application) {
      res
        .status(404)
        .json({ message: "Application not found or unauthorized" });
      return;
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
