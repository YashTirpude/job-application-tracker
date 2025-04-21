import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

const HomePage: React.FC = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(79, 70, 229, 0.3)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  };

  const illustrationVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 min-h-screen flex items-center justify-center p-4 md:p-8">
      <motion.div
        className="max-w-5xl w-full bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side with improved illustration */}
          <motion.div
            className="bg-gradient-to-br from-indigo-800 to-indigo-600 md:w-1/2 p-8 flex items-center justify-center"
            variants={itemVariants}
          >
            <div className="text-white text-center">
              <motion.div variants={illustrationVariants} className="relative">
                <svg
                  className="w-48 h-48 mx-auto mb-6 text-indigo-200 opacity-90"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
                <motion.div
                  className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                />
              </motion.div>
              <motion.h2
                className="text-xl font-bold text-white mb-3"
                variants={itemVariants}
              >
                Career Path Optimizer
              </motion.h2>
              <motion.p
                className="text-indigo-100 mt-4 text-sm md:text-base leading-relaxed"
                variants={itemVariants}
              >
                Organize, visualize, and optimize your entire job search journey
                in one powerful dashboard
              </motion.p>
            </div>
          </motion.div>

          {/* Right side with enhanced content */}
          <motion.div
            className="p-8 md:p-10 md:w-1/2 bg-gray-800"
            variants={itemVariants}
          >
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-center text-white mb-3"
              variants={itemVariants}
            >
              Job Tracker
            </motion.h1>
            <motion.div
              className="h-1 w-16 bg-indigo-500 mx-auto mb-6"
              variants={itemVariants}
            />
            <motion.p
              className="text-gray-300 text-center mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Track, manage, and visualize all your job applications in one
              secure platform designed to maximize your success.
            </motion.p>

            <motion.div
              className="flex flex-col gap-4 max-w-xs mx-auto"
              variants={itemVariants}
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="overflow-hidden rounded-lg"
              >
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all duration-300"
                >
                  <span>Get Started</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="overflow-hidden rounded-lg"
              >
                <Link
                  to="/login"
                  className="bg-transparent border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-900 hover:text-white w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Login</span>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-8 text-center text-gray-400"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center space-x-6 mb-4">
                <div className="flex flex-col items-center">
                  <span className="text-indigo-400 text-xl font-bold">
                    100%
                  </span>
                  <span className="text-xs">Secure</span>
                </div>
                <div className="h-8 w-px bg-gray-700"></div>
                <div className="flex flex-col items-center">
                  <span className="text-indigo-400 text-xl font-bold">
                    24/7
                  </span>
                  <span className="text-xs">Access</span>
                </div>
                <div className="h-8 w-px bg-gray-700"></div>
                <div className="flex flex-col items-center">
                  <span className="text-indigo-400 text-xl font-bold">
                    Free
                  </span>
                  <span className="text-xs">Start</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-6">
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
