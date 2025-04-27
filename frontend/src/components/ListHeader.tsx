import React from "react";
import { motion } from "framer-motion";

interface ListHeaderProps {
  count: number;
  onCreateClick: () => void;
}

const ListHeader: React.FC<ListHeaderProps> = ({ count, onCreateClick }) => {
  const buttonVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.4)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: { scale: 0.97, transition: { duration: 0.1, ease: "easeIn" } },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const countVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut", delay: 0.2 },
    },
    hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-700"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Job Applications
        </h1>
        <motion.span
          className="px-3 py-1 bg-gray-700/50 text-indigo-400 rounded-lg text-sm font-medium border border-indigo-500/30"
          variants={countVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          {count}
        </motion.span>
      </div>
      <motion.button
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md flex items-center gap-2 transition-colors duration-200"
        onClick={onCreateClick}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <span className="text-lg">+</span>
        New Application
      </motion.button>
    </motion.div>
  );
};

export default ListHeader;
