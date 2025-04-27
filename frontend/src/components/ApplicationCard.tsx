import React from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import {
  updateApplication,
  Application,
} from "../store/slices/applicationSlice";
import StatusBadge from "./StatusBadge";
import StatusDropdown from "./StatusDropdown";
import axios from "axios";

interface ApplicationCardProps {
  application: Application;
  onEdit: () => void;
  onDelete: () => void;
  token: string | null;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application: app,
  onEdit,
  onDelete,
  token,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Animation variants
  const cardItem = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.5,
        stiffness: 120,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const buttonHover = {
    scale: 1.1,
    transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 10 },
  };

  const buttonTap = {
    scale: 0.95,
    transition: { duration: 0.1, ease: "easeIn" },
  };

  // Helper functions
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleDownload = async (url: string, filename: string) => {
    try {
      const { data } = await axios.get(url, { responseType: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(data);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      console.error("Download failed");
    }
  };

  const handleView = (url: string) => {
    window.open(url, "_blank");
  };

  function objectToFormData(obj: Record<string, any>) {
    const formData = new FormData();
    for (const key in obj) {
      formData.append(key, obj[key]);
    }
    return formData;
  }

  const updateStatus = (status: string) => {
    if (token) {
      dispatch(
        updateApplication({
          id: app._id,
          formData: objectToFormData({ status }),
          token,
        })
      );
    }
  };

  return (
    <motion.div
      variants={cardItem}
      layoutId={`card-${app._id}`}
      className={`bg-white rounded-xl shadow-sm hover:shadow-md border-l-4 ${getStatusColor(
        app.status
      )} overflow-hidden transition-all duration-300`}
      whileHover={{
        y: -4,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <motion.h2
            className="text-lg font-semibold text-gray-800 truncate"
            layoutId={`title-${app._id}`}
          >
            {app.jobTitle}
          </motion.h2>
          <StatusDropdown
            currentStatus={app.status}
            onStatusChange={updateStatus}
          />
        </div>

        <motion.p
          className="text-gray-700 font-medium flex items-center gap-2 mb-3"
          layoutId={`company-${app._id}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          {app.company}
        </motion.p>

        <div className="space-y-2 text-gray-600 text-sm">
          <p className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Applied: {formatDate(app.dateApplied)}
          </p>

          <p className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            {app.jobPlatform}
          </p>

          {app.description && (
            <motion.p
              className="text-xs text-gray-500 line-clamp-2 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {app.description}
            </motion.p>
          )}
        </div>

        {app.jobUrl && (
          <motion.a
            href={app.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 flex items-center gap-1 mt-3 text-sm hover:text-indigo-800 transition-colors duration-200 w-fit"
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
          >
            View Job
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </motion.a>
        )}

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <motion.button
            className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors duration-200"
            onClick={onEdit}
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </motion.button>

          <div className="flex gap-2">
            {app.resumeUrl && (
              <>
                <motion.button
                  className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors duration-200"
                  onClick={() => handleView(app.resumeUrl)}
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  title="View Resume"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </motion.button>

                <motion.button
                  className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors duration-200"
                  onClick={() =>
                    handleDownload(app.resumeUrl, `${app.jobTitle}-resume.pdf`)
                  }
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  title="Download Resume"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </motion.button>
              </>
            )}

            <motion.button
              className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors duration-200"
              onClick={onDelete}
              whileHover={buttonHover}
              whileTap={buttonTap}
              title="Delete Application"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to get status color
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "border-yellow-500 text-yellow-600 bg-yellow-50";
    case "applied":
      return "border-blue-500 text-blue-600 bg-blue-50";
    case "interview":
      return "border-orange-500 text-orange-600 bg-orange-50";
    case "offer":
      return "border-green-500 text-green-600 bg-green-50";
    case "rejected":
      return "border-red-500 text-red-600 bg-red-50";
    default:
      return "border-gray-500 text-gray-600 bg-gray-50";
  }
};

export default ApplicationCard;
