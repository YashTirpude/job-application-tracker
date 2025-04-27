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
          <span className="text-indigo-400">⚏</span>
          <h2 className="text-lg font-medium text-gray-200">
            Filter by Status
          </h2>
        </div>
        {selectedFilter && (
          <motion.button
            className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1"
            onClick={() => onFilterChange(null)}
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Filter
            <span>×</span>
          </motion.button>
        )}
      </div>

      <motion.div
        className="bg-dark-card/50 backdrop-blur-sm rounded-xl p-3 shadow-md border border-dark-border"
        whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)" }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="flex overflow-x-auto gap-2 pb-1"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.button
            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
              !selectedFilter
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-glow-sm"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
            onClick={() => onFilterChange(null)}
            whileHover={buttonHover}
            whileTap={buttonTap}
            variants={item}
          >
            <span
              className={`bg-white/10 rounded-full w-6 h-6 flex items-center justify-center text-xs`}
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
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
                onClick={() => onFilterChange(status)}
                whileHover={buttonHover}
                whileTap={buttonTap}
                variants={item}
              >
                <span
                  className={`bg-white/10 rounded-full w-6 h-6 flex items-center justify-center text-xs`}
                >
                  {count}
                </span>
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
