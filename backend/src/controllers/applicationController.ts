import { Request, Response } from "express";
import JobApplication from "../models/Application";

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

    const resumeUrl = req.file ? req.file.path : null;

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
