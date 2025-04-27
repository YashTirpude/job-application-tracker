import React from "react";
import { motion } from "framer-motion";

interface ListHeaderProps {
  count: number;
  onCreateClick: () => void;
}

const ListHeader: React.FC<ListHeaderProps> = ({ count, onCreateClick }) => {
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
      className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Job Applications
        </h1>
        <motion.span
          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
          whileHover={{ scale: 1.1 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 15,
            delay: 0.2,
          }}
        >
          {count}
        </motion.span>
      </div>
      <motion.button
        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg flex items-center gap-2"
        onClick={onCreateClick}
        whileHover={buttonHover}
        whileTap={buttonTap}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        New Application
      </motion.button>
    </motion.div>
  );
};

export default ListHeader;
