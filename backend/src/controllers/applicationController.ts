import { Response } from "express";
import JobApplication from "../models/Application";
import { AuthRequest } from "../middleware/authMiddleware";

export const createApplication = async (req: AuthRequest, res: Response) => {
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
      jobTitle: jobTitle.trim().replace(/^"+|"+$/g, ""),
      company: company.trim().replace(/^"+|"+$/g, ""),
      description,
      dateApplied: dateApplied.trim().replace(/^"+|"+$/g, ""),
      status: status.trim().replace(/^"+|"+$/g, ""),
      jobPlatform: jobPlatform.trim().replace(/^"+|"+$/g, ""),
      jobUrl,
      resumeUrl,
      user: req.user._id,
    });

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

    const application = await JobApplication.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!application) {
      res
        .status(404)
        .json({ message: "Application not found or unauthorized" });
      return;
    }

    res.status(200).json(application);
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
