import React from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  type: "empty" | "error";
  message?: string;
  selectedFilter?: string | null;
  onAction?: () => void;
  actionText?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  message,
  selectedFilter,
  onAction,
  actionText,
}) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 10 },
  };

  const buttonTap = {
    scale: 0.95,
    transition: { duration: 0.1, ease: "easeIn" },
  };

  // Empty state
  if (type === "empty") {
    return (
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-xl p-10 text-center max-w-lg mx-auto shadow-md"
        variants={fadeInUp}
        initial="hidden"
        animate="show"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </motion.svg>
        <p className="text-lg font-medium text-gray-700 mb-4">
          {selectedFilter
            ? `No ${selectedFilter} applications found.`
            : "No applications found. Start by creating one!"}
        </p>
        <motion.button
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-medium shadow-md"
          onClick={onAction}
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          {actionText || "Create Application"}
        </motion.button>
      </motion.div>
    );
  }

  // Error state
  return (
    <motion.div
      className="max-w-md mx-auto mt-16 p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-red-100"
      variants={fadeInUp}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-red-500"
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
        <p className="text-lg font-medium text-red-600">
          {message || "An error occurred"}
        </p>
      </div>
      {onAction && (
        <motion.button
          className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
          onClick={onAction}
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          {actionText || "Retry"}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
