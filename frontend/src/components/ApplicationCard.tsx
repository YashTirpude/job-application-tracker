import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import {
  updateApplication,
  Application,
} from "../store/slices/applicationSlice";
import StatusDropdown from "./StatusDropdown";
import axios from "axios";
import {
  ExternalLink,
  FileEdit,
  Eye,
  Download,
  X,
  Calendar,
  Globe,
} from "lucide-react";

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
  const [isHovered, setIsHovered] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delayChildren: 0.1,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
    hover: {
      y: -8,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: "easeIn",
      },
    },
  };

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

  const getStatusColors = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          border: "border-l-yellow-400",
          bg: "bg-yellow-50",
          text: "text-yellow-600",
        };
      case "applied":
        return {
          border: "border-l-blue-400",
          bg: "bg-blue-50",
          text: "text-blue-600",
        };
      case "interview":
        return {
          border: "border-l-orange-400",
          bg: "bg-orange-50",
          text: "text-orange-600",
        };
      case "offer":
        return {
          border: "border-l-green-400",
          bg: "bg-green-50",
          text: "text-green-600",
        };
      case "rejected":
        return {
          border: "border-l-red-400",
          bg: "bg-red-50",
          text: "text-red-600",
        };
      default:
        return {
          border: "border-l-gray-400",
          bg: "bg-gray-50",
          text: "text-gray-600",
        };
    }
  };

  const statusStyles = getStatusColors(app.status);

  return (
    <motion.div
      layout
      layoutId={`card-${app._id}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`bg-white rounded-xl overflow-hidden ${statusStyles.border} border-l-4 shadow-lg transition-all duration-300`}
    >
      <div className="p-6">
        {/* Card header with job title and status */}
        <div className="flex justify-between items-start mb-4">
          <motion.div variants={itemVariants} className="flex-1 mr-4">
            <motion.h2
              layoutId={`title-${app._id}`}
              className="text-xl font-bold text-gray-800 truncate"
            >
              {app.jobTitle}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-700 font-semibold flex items-center gap-2 mt-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
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
          </motion.div>

          <StatusDropdown
            currentStatus={app.status}
            onStatusChange={updateStatus}
          />
        </div>

        {/* Card body with application details */}
        <div className="space-y-2 text-gray-600 mb-6">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2"
          >
            <Calendar size={16} className="text-gray-400" />
            <span>Applied: {formatDate(app.dateApplied)}</span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2"
          >
            <Globe size={16} className="text-gray-400" />
            <span>{app.jobPlatform}</span>
          </motion.div>

          {app.description && (
            <motion.div variants={itemVariants} layout>
              <div
                className="mt-3 pt-3 border-t border-gray-200"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                <motion.p
                  layout
                  className={`text-sm text-gray-500 ${
                    showFullDescription ? "" : "line-clamp-2"
                  } cursor-pointer`}
                >
                  {app.description}
                </motion.p>
                {app.description.length > 120 && (
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="mt-1 text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Actions section */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200">
          {app.jobUrl && (
            <motion.a
              href={app.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm transition-colors duration-200"
            >
              View Job
              <ExternalLink size={14} />
            </motion.a>
          )}

          <div className="flex gap-2 ml-auto">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={onEdit}
              className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200"
            >
              <span className="sr-only">Edit</span>
              <FileEdit size={16} />
            </motion.button>

            {app.resumeUrl && (
              <>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleView(app.resumeUrl)}
                  className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors duration-200"
                >
                  <span className="sr-only">View</span>
                  <Eye size={16} />
                </motion.button>

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() =>
                    handleDownload(app.resumeUrl, `${app.jobTitle}-resume.pdf`)
                  }
                  className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors duration-200"
                >
                  <span className="sr-only">Download</span>
                  <Download size={16} />
                </motion.button>
              </>
            )}

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={onDelete}
              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-200"
            >
              <span className="sr-only">Delete</span>
              <X size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "border-l-yellow-400 text-yellow-600 bg-yellow-50";
    case "applied":
      return "border-l-blue-400 text-blue-600 bg-blue-50";
    case "interview":
      return "border-l-orange-400 text-orange-600 bg-orange-50";
    case "offer":
      return "border-l-green-400 text-green-600 bg-green-50";
    case "rejected":
      return "border-l-red-400 text-red-600 bg-red-50";
    default:
      return "border-l-gray-400 text-gray-600 bg-gray-50";
  }
};

export default ApplicationCard;
