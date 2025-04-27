import React from "react";
import { motion } from "framer-motion";
import { getStatusColor } from "./ApplicationCard";
import { Application } from "../store/slices/applicationSlice";

interface StatusFilterProps {
  applications: Application[];
  selectedFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  applications,
  selectedFilter,
  onFilterChange,
}) => {
  const statusOptions = [
    "pending",
    "applied",
    "interview",
    "offer",
    "rejected",
  ];

  // Animation variants matching ApplicationCard style
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
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

  const buttonVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.4)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.97 },
  };

  // Get status icon matching ApplicationCard
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="text-yellow-400"
          >
            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
          </svg>
        );
      case "applied":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="text-indigo-400"
          >
            <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z" />
            <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z" />
            <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3Z" />
          </svg>
        );
      case "interview":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="text-orange-400"
          >
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
          </svg>
        );
      case "offer":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="text-emerald-400"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
          </svg>
        );
      case "rejected":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="text-red-400"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="text-gray-400"
          >
            <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 4.854-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
          </svg>
        );
    }
  };

  // Get text color based on status to match ApplicationCard
  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-400";
      case "applied":
        return "text-indigo-400";
      case "interview":
        return "text-orange-400";
      case "offer":
        return "text-emerald-400";
      case "rejected":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <motion.div
      className="mb-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="text-indigo-400"
          >
            <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z" />
            <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
          </svg>
          <h2 className="text-lg font-bold text-white">Filter by Status</h2>
        </div>
        {selectedFilter && (
          <motion.button
            className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1.5"
            onClick={() => onFilterChange(null)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Clear Filter
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </motion.button>
        )}
      </div>

      <motion.div
        className="bg-gray-800 shadow-2xl rounded-2xl p-4 border border-gray-700"
        variants={itemVariants}
        whileHover={{
          boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.3)",
          transition: { duration: 0.3 },
        }}
      >
        <motion.div
          className="flex flex-wrap gap-2"
          variants={containerVariants}
        >
          <motion.button
            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
              !selectedFilter
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => onFilterChange(null)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span
              className={`${
                !selectedFilter ? "bg-indigo-700" : "bg-gray-800"
              } rounded-full w-6 h-6 flex items-center justify-center text-xs`}
            >
              {applications.length}
            </span>
            All
          </motion.button>

          {statusOptions.map((status) => {
            const count = applications.filter(
              (app) => app.status.toLowerCase() === status.toLowerCase()
            ).length;

            return (
              <motion.button
                key={status}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 capitalize transition-all duration-200 ${
                  selectedFilter === status
                    ? getStatusColor(status)
                    : "bg-gray-700 hover:bg-gray-600"
                } ${
                  selectedFilter === status
                    ? getStatusTextColor(status)
                    : "text-gray-300"
                }`}
                onClick={() => onFilterChange(status)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(status)}
                  <span
                    className={`${
                      selectedFilter === status
                        ? getStatusColor(status).replace(
                            "bg-",
                            "bg-opacity-70 bg-"
                          )
                        : "bg-gray-800"
                    } rounded-full w-6 h-6 flex items-center justify-center text-xs`}
                  >
                    {count}
                  </span>
                </div>
                {status}
              </motion.button>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default StatusFilter;
