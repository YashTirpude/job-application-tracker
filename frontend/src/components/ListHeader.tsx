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
      className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-dark-card/50 backdrop-blur-sm rounded-xl p-6 shadow-md border border-dark-border"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
          Job Applications
        </h1>
        <motion.span
          className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/20"
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
        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-glow flex items-center gap-2 group"
        onClick={onCreateClick}
        whileHover={buttonHover}
        whileTap={buttonTap}
      >
        <span className="text-lg group-hover:rotate-90 transition-transform duration-300">
          +
        </span>
        New Application
      </motion.button>
    </motion.div>
  );
};

export default ListHeader;
