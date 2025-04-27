import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 border-r-indigo-600"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <motion.p
        className="text-gray-600 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 border-r-indigo-600 mx-auto"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Loading Your Applications
          </h2>
          <p className="text-gray-600">Gathering your job search data</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-5 border-l-4 border-gray-200 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
      </div>

      <div className="h-5 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>

      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>

      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="h-8 bg-gray-200 rounded-full w-8 animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded-full w-8 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-full w-8 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-full w-8 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};
