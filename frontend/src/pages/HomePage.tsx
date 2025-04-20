import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side with illustration */}
          <motion.div
            className="bg-indigo-600 md:w-1/2 p-8 flex items-center justify-center"
            variants={itemVariants}
          >
            <div className="text-white text-center">
              <svg
                className="w-40 h-40 mx-auto mb-6 text-indigo-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
              <p className="text-indigo-200 mt-4 text-sm">
                Organize and optimize your job search journey
              </p>
            </div>
          </motion.div>

          {/* Right side with content */}
          <motion.div className="p-8 md:w-1/2" variants={itemVariants}>
            <motion.h1
              className="text-3xl font-bold text-center text-gray-800 mb-2"
              variants={itemVariants}
            >
              Job Tracker App
            </motion.h1>
            <motion.p
              className="text-gray-600 text-center mb-8"
              variants={itemVariants}
            >
              Track, manage, and visualize all your job applications in one
              place.
            </motion.p>

            <motion.div className="flex flex-col gap-4" variants={itemVariants}>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to="/register"
                  className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-700 border-none"
                >
                  Get Started
                </Link>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to="/login"
                  className="btn btn-outline w-full border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white"
                >
                  Login
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-8 text-center text-sm text-gray-500"
              variants={itemVariants}
            >
              <p>Streamline your job hunt and boost your career prospects</p>
              <p className="mt-2">
                Track metrics, set reminders, and never miss an opportunity
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
