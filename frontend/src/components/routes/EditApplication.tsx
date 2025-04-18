import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { AppDispatch, RootState } from "../../store";
import { setLoading } from "../../store/slices/authSlice";
import { updateApplication } from "../../store/slices/applicationSlice";
import api from "../../services/api";

interface FormData {
  jobTitle: string;
  company: string;
  description: string;
  dateApplied: string;
  status: string;
  jobPlatform: string;
  jobUrl: string;
  resume: File | null;
}

const EditApplicationForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [apiError, setApiError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  console.log("EditApplicationForm: id =", id, "token =", !!token);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
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

  useEffect(() => {
    if (!id) {
      console.error("No ID provided in URL");
      setApiError("Invalid application ID");
      setIsLoading(false);
      return;
    }
    if (!token) {
      console.error("No token found, redirecting to login");
      setApiError("Please login to edit an application");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    const fetchApplication = async () => {
      try {
        console.log("Fetching application for id:", id);
        dispatch(setLoading(true));
        const res = await api.get(`/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API response:", res.data);
        const app = res.data;
        reset({
          jobTitle: app.jobTitle || "",
          company: app.company || "",
          description: app.description || "",
          dateApplied: app.dateApplied ? app.dateApplied.split("T")[0] : "",
          status: app.status || "applied",
          jobPlatform: app.jobPlatform || "",
          jobUrl: app.jobUrl || "",
          resume: null,
        });
        setIsLoading(false);
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message || "Failed to fetch application";
        console.error("Fetch error:", err.response?.status, err.response?.data);
        setApiError(errorMsg);
        setIsLoading(false);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchApplication();
  }, [id, token, dispatch, navigate, reset]);

  const onSubmit = async (data: FormData) => {
    if (!token || !id) {
      setApiError("No token or ID found. Please login.");
      return;
    }

    try {
      setApiError(null);
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
        updateApplication({ id, formData: formDataToSend, token })
      ).unwrap();

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log("✅ Updated:", result);

      setTimeout(() => {
        navigate("/applications");
      }, 500);
    } catch (err: any) {
      setApiError(err.message || "Failed to update application");
      console.error("❌ Submit error:", err);
      setUploadProgress(0);
    }
  };

  console.log(
    "Rendering: isLoading =",
    isLoading,
    "apiError =",
    apiError,
    "isSubmitting =",
    isSubmitting
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <motion.div
          className="card bg-base-100 shadow-xl max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-body">
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="container mx-auto px-4 py-10">
        <motion.div
          className="card bg-base-100 shadow-xl max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-body">
            <motion.div
              className="alert alert-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{apiError}</span>
            </motion.div>
            <motion.button
              className="btn btn-primary w-full mt-4"
              onClick={() => navigate("/applications")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Applications
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
      >
        <div className="card-body">
          <motion.h1
            className="text-3xl font-bold text-base-content text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Edit Application
          </motion.h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            encType="multipart/form-data"
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
                  className="input input-bordered w-full"
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.jobTitle && (
              <p className="text-sm text-red-600 mt-1">
                {errors.jobTitle.message}
              </p>
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
                  className="input input-bordered w-full"
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.company && (
              <p className="text-sm text-red-600 mt-1">
                {errors.company.message}
              </p>
            )}

            <Controller
              name="description"
              control={control}
              rules={{ required: "Job Description is required" }}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Job Description"
                  className="input input-bordered w-full h-24"
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}

            <Controller
              name="dateApplied"
              control={control}
              rules={{ required: "Date Applied is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className="input input-bordered w-full"
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.dateApplied && (
              <p className="text-sm text-red-600 mt-1">
                {errors.dateApplied.message}
              </p>
            )}

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="select select-bordered w-full"
                  disabled={isSubmitting}
                >
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
                  className="input input-bordered w-full"
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.jobPlatform && (
              <p className="text-sm text-red-600 mt-1">
                {errors.jobPlatform.message}
              </p>
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
                  className="input input-bordered w-full"
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.jobUrl && (
              <p className="text-sm text-red-600 mt-1">
                {errors.jobUrl.message}
              </p>
            )}

            <Controller
              name="resume"
              control={control}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <input
                  {...fieldProps}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="input input-bordered w-full"
                  disabled={isSubmitting}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onChange(file);
                  }}
                />
              )}
            />

            <motion.button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  {uploadProgress}% Complete
                </>
              ) : (
                "Update Application"
              )}
            </motion.button>

            <motion.button
              type="button"
              className="btn btn-outline w-full mt-2"
              onClick={() => navigate("/applications")}
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditApplicationForm;
