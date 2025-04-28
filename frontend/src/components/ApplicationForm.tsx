import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { addApplication } from "../store/slices/applicationSlice";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { CheckCircle, XCircle } from "lucide-react";

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
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="text-red-400" size={20} />
          <span>You must be logged in to submit the application.</span>
        </div>
      );
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
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-400" size={20} />
          <span>Application submitted successfully!</span>
        </div>
      );

      setTimeout(() => {
        navigate("/applications");
      }, 500);
    } catch (err: any) {
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="text-red-400" size={20} />
          <span>Error submitting application. Please try again.</span>
        </div>
      );
      setUploadProgress(0);
    }
  };

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
        Job Application Form
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

        <motion.div variants={itemVariants} className="mt-6">
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
              "Submit Application"
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default ApplicationForm;
