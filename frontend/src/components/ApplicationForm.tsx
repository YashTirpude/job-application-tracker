import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { addApplication } from "../store/slices/applicationSlice";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-base-200 p-6 rounded-box shadow-lg max-w-xl mx-auto mt-10"
    >
      <motion.h2
        className="text-2xl font-bold text-primary text-center mb-6"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Job Application Form
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="form-control">
          <label className="label">
            <span className="label-text">Job Title</span>
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
                className="input input-bordered w-full"
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
                className="text-sm text-error mt-1"
              >
                {errors.jobTitle.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="form-control">
          <label className="label">
            <span className="label-text">Company</span>
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
                className="input input-bordered w-full"
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
                className="text-sm text-error mt-1"
              >
                {errors.company.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="form-control">
          <label className="label">
            <span className="label-text">Job Description</span>
          </label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Job Description is required" }}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Detail the job requirements and responsibilities"
                className="textarea textarea-bordered w-full"
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
                className="text-sm text-error mt-1"
              >
                {errors.description.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="form-control">
          <label className="label">
            <span className="label-text">Date Applied</span>
          </label>
          <Controller
            name="dateApplied"
            control={control}
            rules={{ required: "Date Applied is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className="input input-bordered w-full"
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
                className="text-sm text-error mt-1"
              >
                {errors.dateApplied.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="form-control">
          <label className="label">
            <span className="label-text">Status</span>
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select {...field} className="select select-bordered w-full">
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
                <option value="offer">Offer</option>
              </select>
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="form-control">
          <label className="label">
            <span className="label-text">Job Platform</span>
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
                className="input input-bordered w-full"
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
                className="text-sm text-error mt-1"
              >
                {errors.jobPlatform.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="form-control">
          <label className="label">
            <span className="label-text">Job URL</span>
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
                className="input input-bordered w-full"
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
                className="text-sm text-error mt-1"
              >
                {errors.jobUrl.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="form-control">
          <label className="label">
            <span className="label-text">Resume (Optional)</span>
          </label>
          <Controller
            name="resume"
            control={control}
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <input
                {...fieldProps}
                type="file"
                accept=".pdf,.doc,.docx"
                className="file-input file-input-bordered w-full"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  onChange(file);
                }}
              />
            )}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6"
        >
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <span className="loading loading-spinner loading-sm mr-2"></span>
                <motion.div style={{ "--value": uploadProgress } as any}>
                  {uploadProgress}%
                </motion.div>
              </div>
            ) : (
              "Submit Application"
            )}
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default ApplicationForm;
