import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ApplicationForm = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    description: "",
    dateApplied: "",
    status: "applied",
    jobPlatform: "",
    jobUrl: "",
    resume: null as File | null,
  });

  // Update form fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  // Just console.log for now — we'll send data in Step 2
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("jobTitle", formData.jobTitle);
      formDataToSend.append("company", formData.company);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("dateApplied", formData.dateApplied);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("jobPlatform", formData.jobPlatform);
      formDataToSend.append("jobUrl", formData.jobUrl);

      if (formData.resume) {
        formDataToSend.append("resume", formData.resume);
      }

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }

      const result = await res.json();
      console.log("✅ Application submitted:", result);
    } catch (error: any) {
      console.error("❌ Submission error:", error);
    }
  };
  console.log("Token in Redux:", token);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto mt-10">
      <input
        type="text"
        name="jobTitle"
        placeholder="Job Title"
        value={formData.jobTitle}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        name="company"
        placeholder="Company"
        value={formData.company}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        name="description"
        placeholder="Job Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        rows={4}
        required
      />

      <input
        type="date"
        name="dateApplied"
        value={formData.dateApplied}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="rejected">Rejected</option>
        <option value="offer">Offer</option>
      </select>

      <input
        type="text"
        name="jobPlatform"
        placeholder="Job Platform (e.g. LinkedIn)"
        value={formData.jobPlatform}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        name="jobUrl"
        placeholder="Job Listing URL"
        value={formData.jobUrl}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="file"
        name="resume"
        onChange={handleFileChange}
        className="w-full"
        accept=".pdf,.doc,.docx"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Application
      </button>
    </form>
  );
};

export default ApplicationForm;
