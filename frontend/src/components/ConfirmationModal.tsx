import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const buttonVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.4)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: { scale: 0.97, transition: { duration: 0.1, ease: "easeIn" } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeOut" } },
  };

  const iconVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, -5, 0, 5, 0],
      transition: { duration: 0.5, ease: "easeInOut", delay: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onCancel}
        >
          <motion.div
            className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-white text-center mb-4">
              {title}
            </h3>
            <div className="text-center mb-6">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-indigo-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                variants={iconVariants}
                initial="initial"
                animate="animate"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </motion.svg>
              <p className="text-base text-gray-300">{message}</p>
              <p className="text-xs text-gray-500 mt-1">
                This action is permanent.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <motion.button
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-colors duration-200"
                onClick={onConfirm}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {confirmText}
              </motion.button>
              <motion.button
                className="px-5 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium shadow-sm hover:bg-gray-600 transition-colors duration-200"
                onClick={onCancel}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {cancelText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
