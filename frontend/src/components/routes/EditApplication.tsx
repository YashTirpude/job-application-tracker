import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { AppDispatch, RootState } from "../../store";
import { setLoading } from "../../store/slices/authSlice";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

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
        dispatch(setLoading(true));
        const res = await api.get(`/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      };

      await api.put(`/applications/${id}`, formDataToSend, config);

      setTimeout(() => {
        navigate("/applications");
      }, 800);
    } catch (err: any) {
      setApiError(
        err.response?.data?.message || "Failed to update application"
      );
      setUploadProgress(0);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <motion.div
          className="bg-white shadow-xl max-w-xl mx-auto rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center justify-center min-h-64 p-6">
            <motion.div
              className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 1,
                ease: "linear",
              }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-gray-600"
            >
              Loading application details...
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="container mx-auto px-4 py-10">
        <motion.div
          className="bg-white shadow-xl max-w-xl mx-auto rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6">
            <motion.div
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="ml-3">{apiError}</span>
            </motion.div>
            <motion.button
              className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={() => navigate("/applications")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Back to Applications
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 max-w-xl mx-auto rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring", damping: 15 }}
      >
        <div className="p-6">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-3xl font-bold text-center text-indigo-600">
              Edit Application
            </h1>
            <motion.div
              className="w-16 h-1 bg-indigo-600 mx-auto mt-2 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            ></motion.div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            encType="multipart/form-data"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="form-control">
              <label className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <Controller
                name="jobTitle"
                control={control}
                rules={{ required: "Job Title is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Job Title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.jobTitle && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.jobTitle.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="form-control">
              <label className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <Controller
                name="company"
                control={control}
                rules={{ required: "Company is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Company"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.company && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.company.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="form-control">
              <label className="block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Job Description is required" }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Job Description"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-32"
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.description.message}
                </motion.p>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="form-control">
                <label className="block text-sm font-medium text-gray-700">
                  Date Applied
                </label>
                <Controller
                  name="dateApplied"
                  control={control}
                  rules={{ required: "Date Applied is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.dateApplied && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.dateApplied.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="form-control">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      disabled={isSubmitting}
                    >
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="rejected">Rejected</option>
                      <option value="offer">Offer</option>
                    </select>
                  )}
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="form-control">
              <label className="block text-sm font-medium text-gray-700">
                Job Platform
              </label>
              <Controller
                name="jobPlatform"
                control={control}
                rules={{ required: "Job Platform is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Job Platform (e.g. LinkedIn)"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.jobPlatform && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.jobPlatform.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="form-control">
              <label className="block text-sm font-medium text-gray-700">
                Job URL
              </label>
              <Controller
                name="jobUrl"
                control={control}
                rules={{ required: "Job URL is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Job Listing URL"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.jobUrl && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.jobUrl.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="form-control">
              <label className="block text-sm font-medium text-gray-700">
                Resume (Optional)
              </label>
              <Controller
                name="resume"
                control={control}
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <div className="flex flex-col">
                    <input
                      {...fieldProps}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 file:bg-white file:text-gray-700 file:rounded-md file:border-0 file:mr-4 file:py-2 file:px-4 hover:file:bg-gray-100"
                      disabled={isSubmitting}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        onChange(file);
                      }}
                    />
                    <span className="mt-1 text-xs text-gray-500">
                      Accepted formats: PDF, DOC, DOCX
                    </span>
                  </div>
                )}
              />
            </motion.div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                className="w-full mt-2"
              >
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{uploadProgress}%</p>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="pt-4 space-y-3">
              <motion.button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed"
                onClick={() => navigate("/applications")}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditApplicationForm;
