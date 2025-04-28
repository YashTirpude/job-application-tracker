import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { AppDispatch, RootState } from "../../store";
import { setLoading } from "../../store/slices/authSlice";
import api from "../../services/api";
import { toast } from "react-toastify";
import { CheckCircle, XCircle } from "lucide-react";

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.4)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: { scale: 0.97, transition: { duration: 0.1, ease: "easeIn" } },
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
        toast.error(errorMsg);
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

      await api.put(`/applications/${id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-400" size={20} />
          <span>Application updated successfully!</span>
        </div>
      );

      setTimeout(() => {
        navigate("/applications");
      }, 500);
    } catch (err: any) {
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="text-red-400" size={20} />
          <span>Failed to update application.</span>
        </div>
      );
      setUploadProgress(0);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <motion.div
          className="bg-gray-800/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl max-w-xl mx-auto border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center justify-center min-h-64 p-6">
            <motion.div
              className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
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
              className="mt-4 text-gray-300"
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
          className="bg-gray-800/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl max-w-xl mx-auto border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6">
            <motion.div
              className="bg-red-900/50 border border-red-800 text-red-300 p-4 rounded-lg flex items-center"
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
              className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              onClick={() => navigate("/applications")}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Back to Applications
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-800/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl max-w-xl mx-auto mt-10 border border-gray-700"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-2xl font-semibold text-white text-center mb-6"
        variants={itemVariants}
      >
        Edit Job Application
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="space-y-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col">
          <label className="block text-sm font-medium text-gray-300">
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
                placeholder="Senior Developer"
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
              />
            )}
          />
          <AnimatePresence>
            {errors.jobTitle && (
              <motion.p
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-sm text-red-400 mt-1"
              >
                {errors.jobTitle.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col">
          <label className="block text-sm font-medium text-gray-300">
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
                placeholder="Tech Inc."
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
              />
            )}
          />
          <AnimatePresence>
            {errors.company && (
              <motion.p
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-sm text-red-400 mt-1"
              >
                {errors.company.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col">
          <label className="block text-sm font-medium text-gray-300">
            Job Description
          </label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Job Description is required" }}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Detail the job requirements and responsibilities"
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
                rows={4}
              />
            )}
          />
          <AnimatePresence>
            {errors.description && (
              <motion.p
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-sm text-red-400 mt-1"
              >
                {errors.description.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col">
          <label className="block text-sm font-medium text-gray-300">
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
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
              />
            )}
          />
          <AnimatePresence>
            {errors.dateApplied && (
              <motion.p
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-sm text-red-400 mt-1"
              >
                {errors.dateApplied.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col">
          <label className="block text-sm font-medium text-gray-300">
            Status
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
                <option value="offer">Offer</option>
              </select>
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col">
          <label className="block text-sm font-medium text-gray-300">
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
                placeholder="LinkedIn, Indeed, etc."
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
              />
            )}
          />
          <AnimatePresence>
            {errors.jobPlatform && (
              <motion.p
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-sm text-red-400 mt-1"
              >
                {errors.jobPlatform.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col">
          <label className="block text-sm font-medium text-gray-300">
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
                placeholder="https://example.com/job-listing"
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
              />
            )}
          />
          <AnimatePresence>
            {errors.jobUrl && (
              <motion.p
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-sm text-red-400 mt-1"
              >
                {errors.jobUrl.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col">
          <label className="block text-sm font-medium text-gray-300">
            Resume (Optional)
          </label>
          <Controller
            name="resume"
            control={control}
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <input
                {...fieldProps}
                type="file"
                accept=".pdf,.doc,.docx"
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 file:bg-gray-600 file:border-0 file:text-gray-300 file:rounded-lg file:px-3 file:py-1 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  onChange(file);
                }}
              />
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 space-y-4">
          <motion.button
            type="submit"
            className="bg-indigo-600 text-white rounded-lg w-full h-12 flex items-center justify-center shadow-md hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
            disabled={isSubmitting}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  className="w-5 h-5 rounded-full border-2 border-white border-t-indigo-400"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <span>{uploadProgress}%</span>
              </div>
            ) : (
              "Update Application"
            )}
          </motion.button>

          <motion.button
            type="button"
            className="bg-gray-700 text-gray-300 rounded-lg w-full h-12 flex items-center justify-center shadow-md hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={() => navigate("/applications")}
            disabled={isSubmitting}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Cancel
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default EditApplicationForm;
