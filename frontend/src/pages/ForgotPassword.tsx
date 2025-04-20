import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      setSuccessMessage(null);
      dispatch(setLoading(true));

      const res = await api.post("/auth/forgot-password", {
        email: data.email,
      });
      setSuccessMessage(
        res.data.message ||
          "Reset link sent to your email! Check your  Spam Box or Inbox"
      );
      dispatch(setLoading(false));

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to send reset link";
      setApiError(errorMsg);
      console.error("❌ Error:", err.response?.status, err.response?.data);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow max-w-md mx-auto"
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
            Forgot Password
          </motion.h1>

          {successMessage ? (
            <motion.div
              className="alert alert-success"
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{successMessage}</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {apiError && (
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
              )}

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
                  <input
                    {...field}
                    type="email"
                    placeholder="Email"
                    className="input input-bordered w-full"
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}

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
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>

              <motion.button
                type="button"
                className="btn btn-outline w-full mt-2"
                onClick={() => navigate("/login")}
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Login
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
