import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

import { AppDispatch } from "../store";
import { setLoading } from "../store/slices/authSlice";
import api from "../services/api";

interface FormData {
  email: string;
}

const ForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setApiError(null);
      dispatch(setLoading(true));

      const res = await api.post("/auth/forgot-password", {
        email: data.email,
      });

      const successMessage =
        res.data.message ||
        "Reset link sent to your email! Check your Spam Box or Inbox";

      // Show success toast notification
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "bg-gray-800 text-white",

        progressClassName: "bg-gradient-to-r from-violet-600 to-indigo-600",
        icon: (
          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg
              className="h-4 w-4 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        ),
      });

      dispatch(setLoading(false));

      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to send reset link";
      setApiError(errorMsg);

      // Show error toast notification
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "bg-gray-800 text-white",

        progressClassName: "bg-red-500",
        icon: (
          <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="h-4 w-4 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        ),
      });

      console.error("❌ Error:", err.response?.status, err.response?.data);
      dispatch(setLoading(false));
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const buttonVariants = {
    hover: { scale: 1.03, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)" },
    tap: { scale: 0.97 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-12">
      {/* Custom styled ToastContainer */}

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Decorative Elements */}
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-24 right-1/4 w-60 h-60 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>
        </motion.div>

        <motion.div
          className="relative z-10 bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 backdrop-blur-sm"
          initial={{ scale: 0.97 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ boxShadow: "0 22px 40px -12px rgba(0, 0, 0, 0.7)" }}
        >
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-10 relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            ></motion.div>

            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-5 flex items-center justify-center rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
              >
                <svg
                  className="w-10 h-10 text-indigo-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </motion.div>

              <motion.h1
                className="text-3xl font-bold text-white text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Recover Your Password
              </motion.h1>
              <motion.p
                className="text-indigo-200 text-center mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                We'll send you a secure link to reset your password
              </motion.p>
            </motion.div>
          </div>

          <div className="p-8">
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {apiError && (
                <motion.div
                  className="bg-gray-700/50 border-l-4 border-red-500 p-4 rounded-lg backdrop-blur-sm"
                  variants={itemVariants}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <motion.div
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center"
                      >
                        <svg
                          className="h-5 w-5 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </motion.div>
                    </div>
                    <span className="ml-3 text-red-300">{apiError}</span>
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email Address
                </label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className="relative"
                    >
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </span>
                      <input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className={`block w-full pl-10 pr-4 py-4 bg-gray-700/80 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-200 placeholder-gray-500 ${
                          errors.email ? "border-red-500" : "border-gray-600"
                        }`}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                  )}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400 mt-1 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <motion.button
                  type="submit"
                  className="w-full py-4 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800"
                  disabled={isSubmitting}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending Reset Link...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Send Password Reset Link
                    </span>
                  )}
                </motion.button>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6 text-center">
                <motion.button
                  type="button"
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
                  onClick={() => navigate("/login")}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                  Back to Login
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
