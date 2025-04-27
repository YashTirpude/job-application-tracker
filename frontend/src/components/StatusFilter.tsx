import React from "react";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 10 },
  };

  const buttonTap = {
    scale: 0.95,
    transition: { duration: 0.1, ease: "easeIn" },
  };

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <h2 className="text-lg font-medium text-gray-800">
            Filter by Status
          </h2>
        </div>
        {selectedFilter && (
          <motion.button
            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
            onClick={() => onFilterChange(null)}
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Filter
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        )}
      </div>

      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-md"
        whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)" }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.button
            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors duration-200 ${
              !selectedFilter
                ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => onFilterChange(null)}
            whileHover={buttonHover}
            whileTap={buttonTap}
            variants={item}
          >
            <span
              className={`bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs ${
                !selectedFilter ? "text-white" : "text-gray-600"
              }`}
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
                    ? `${getStatusColor(status)} shadow-md`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => onFilterChange(status)}
                whileHover={buttonHover}
                whileTap={buttonTap}
                variants={item}
              >
                <span
                  className={`bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs ${
                    selectedFilter === status ? "" : "text-gray-600"
                  }`}
                >
                  {count}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {status === "pending" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                  {status === "applied" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                  {status === "interview" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  )}
                  {status === "offer" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                  {status === "rejected" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )}
                </svg>
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
