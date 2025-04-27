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
  const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 10 },
  };

  const buttonTap = {
    scale: 0.95,
    transition: { duration: 0.1, ease: "easeIn" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel} // Close when clicking the overlay
        >
          <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-md w-full shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the modal
          >
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
              {title}
            </h3>
            <div className="text-center mb-6">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ rotate: -5 }}
                animate={{ rotate: [0, -5, 0, 5, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </motion.svg>
              <p className="text-base text-gray-700">{message}</p>
              <p className="text-xs text-gray-500 mt-1">
                This action is permanent.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <motion.button
                className="px-5 py-2 bg-red-600 text-white rounded-lg font-medium shadow-md hover:bg-red-700"
                onClick={onConfirm}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                {confirmText}
              </motion.button>
              <motion.button
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium shadow-sm hover:bg-gray-300"
                onClick={onCancel}
                whileHover={buttonHover}
                whileTap={buttonTap}
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
