import { Request, Response } from "express";
import JobApplication from "../models/Application";

// 📌 Create a new job application
export const createApplication = async (req: Request, res: Response) => {
  try {
    const {
      jobTitle,
      company,
      description,
      dateApplied,
      status,
      jobPlatform,
      jobUrl,
    } = req.body;

    // Resume file URL (uploaded to Cloudinary)
    const resumeUrl = req.file ? req.file.path : null;

    // Create a new job application document
    const newApplication = new JobApplication({
      jobTitle,
      company,
      description,
      dateApplied,
      status,
      jobPlatform,
      jobUrl,
      resumeUrl,
    });

    await newApplication.save();
    res.status(201).json(newApplication);
    return;
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

// 📌 Get all job applications

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const applications = await JobApplication.find();
    res.status(200).json(applications);
    return;
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

// 📌 Get a single job application by ID

export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findById(id);

    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    res.status(200).json(application);
    return;
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

// 📌 Update a job application

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedApplication) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    res.status(200).json(updatedApplication);
    return;
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

// 📌 Delete a job application

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedApplication = await JobApplication.findByIdAndDelete(id);

    if (!deletedApplication) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    res.status(200).json({ message: "Application deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};
