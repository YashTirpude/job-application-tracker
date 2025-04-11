import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { addApplication } from "../store/slices/applicationSlice";
import { useForm, Controller } from "react-hook-form";

const ApplicationForm = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      jobTitle: "",
      company: "",
      description: "",
      dateApplied: "",
      status: "applied",
      jobPlatform: "",
      jobUrl: "",
      resume: null,
    },
  });

  const onSubmit = async (data: any) => {
    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    try {
      setUploadProgress(0);

      const formDataToSend = new FormData();
      formDataToSend.append("jobTitle", data.jobTitle);
      formDataToSend.append("company", data.company);
      formDataToSend.append("description", data.description);
      formDataToSend.append("dateApplied", data.dateApplied);
      formDataToSend.append("status", data.status);
      formDataToSend.append("jobPlatform", data.jobPlatform);
      formDataToSend.append("jobUrl", data.jobUrl);
      if (data.resume) {
        formDataToSend.append("resume", data.resume);
      }

      let simulatedProgress = 0;
      const progressInterval = setInterval(() => {
        const increment = Math.max(
          1,
          Math.floor((100 - simulatedProgress) / 10)
        );
        simulatedProgress = Math.min(simulatedProgress + increment, 90);
        setUploadProgress(simulatedProgress);
      }, 200);

      const result = await dispatch(
        addApplication({ formData: formDataToSend, token })
      ).unwrap();

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log("✅ Submitted:", result);

      setTimeout(() => {
        navigate("/applications");
      }, 500);
    } catch (err: any) {
      console.error("❌ Error:", err.message || err);
      setUploadProgress(0);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className="space-y-4 max-w-xl mx-auto mt-10"
    >
      <Controller
        name="jobTitle"
        control={control}
        rules={{ required: "Job Title is required" }}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            placeholder="Job Title"
            className="w-full p-2 border rounded"
          />
        )}
      />
      {errors.jobTitle && (
        <p className="text-sm text-red-600">{errors.jobTitle.message}</p>
      )}

      <Controller
        name="company"
        control={control}
        rules={{ required: "Company is required" }}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            placeholder="Company"
            className="w-full p-2 border rounded"
          />
        )}
      />
      {errors.company && (
        <p className="text-sm text-red-600">{errors.company.message}</p>
      )}

      <Controller
        name="description"
        control={control}
        rules={{ required: "Job Description is required" }}
        render={({ field }) => (
          <textarea
            {...field}
            placeholder="Job Description"
            className="w-full p-2 border rounded"
            rows={4}
          />
        )}
      />
      {errors.description && (
        <p className="text-sm text-red-600">{errors.description.message}</p>
      )}

      <Controller
        name="dateApplied"
        control={control}
        rules={{ required: "Date Applied is required" }}
        render={({ field }) => (
          <input {...field} type="date" className="w-full p-2 border rounded" />
        )}
      />
      {errors.dateApplied && (
        <p className="text-sm text-red-600">{errors.dateApplied.message}</p>
      )}

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <select {...field} className="w-full p-2 border rounded">
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="offer">Offer</option>
          </select>
        )}
      />

      <Controller
        name="jobPlatform"
        control={control}
        rules={{ required: "Job Platform is required" }}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            placeholder="Job Platform (e.g. LinkedIn)"
            className="w-full p-2 border rounded"
          />
        )}
      />
      {errors.jobPlatform && (
        <p className="text-sm text-red-600">{errors.jobPlatform.message}</p>
      )}

      <Controller
        name="jobUrl"
        control={control}
        rules={{ required: "Job URL is required" }}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            placeholder="Job Listing URL"
            className="w-full p-2 border rounded"
          />
        )}
      />
      {errors.jobUrl && (
        <p className="text-sm text-red-600">{errors.jobUrl.message}</p>
      )}

      <Controller
        name="resume"
        control={control}
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <input
            {...fieldProps}
            type="file"
            accept=".pdf,.doc,.docx"
            className="w-full"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              onChange(file);
            }}
          />
        )}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center w-full mt-4"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {uploadProgress}% Complete
          </>
        ) : (
          "Submit Application"
        )}
      </button>
    </form>
  );
};

export default ApplicationForm;
