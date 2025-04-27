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
        type: "spring",
        duration: 0.6,
        stiffness: 100,
        damping: 15,
        delayChildren: 0.1,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    hover: {
      y: -8,
      boxShadow: "0 10px 30px -10px rgba(79, 70, 229, 0.3)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
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
          border: "border-yellow-500/50",
          bg: "bg-yellow-500/10",
          text: "text-yellow-200",
          glow: "shadow-yellow-500/20",
          ring: "ring-yellow-500/30",
          hover: "hover:bg-yellow-500/20",
        };
      case "applied":
        return {
          border: "border-blue-500/50",
          bg: "bg-blue-500/10",
          text: "text-blue-200",
          glow: "shadow-blue-500/20",
          ring: "ring-blue-500/30",
          hover: "hover:bg-blue-500/20",
        };
      case "interview":
        return {
          border: "border-orange-500/50",
          bg: "bg-orange-500/10",
          text: "text-orange-200",
          glow: "shadow-orange-500/20",
          ring: "ring-orange-500/30",
          hover: "hover:bg-orange-500/20",
        };
      case "offer":
        return {
          border: "border-green-500/50",
          bg: "bg-green-500/10",
          text: "text-green-200",
          glow: "shadow-green-500/20",
          ring: "ring-green-500/30",
          hover: "hover:bg-green-500/20",
        };
      case "rejected":
        return {
          border: "border-red-500/50",
          bg: "bg-red-500/10",
          text: "text-red-200",
          glow: "shadow-red-500/20",
          ring: "ring-red-500/30",
          hover: "hover:bg-red-500/20",
        };
      default:
        return {
          border: "border-gray-500/50",
          bg: "bg-gray-500/10",
          text: "text-gray-200",
          glow: "shadow-gray-500/20",
          ring: "ring-gray-500/30",
          hover: "hover:bg-gray-500/20",
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
      whileHover={isHovered ? "hover" : "visible"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden ${statusStyles.border} border-l-4 shadow-lg transition-all duration-300`}
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="p-6 relative">
        {/* Subtle background gradient effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 rounded-xl"
          style={{
            background: `radial-gradient(circle at 120% 50%, ${statusStyles.bg
              .replace("bg-", "")
              .replace("-500/10", "-500")}, transparent 80%)`,
          }}
        />

        {/* Card header with job title and status */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <motion.div variants={itemVariants} className="flex-1 mr-4">
            <motion.h2
              layoutId={`title-${app._id}`}
              className="text-xl font-bold text-gray-100 mb-1 truncate group-hover:text-white"
            >
              {app.jobTitle}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-300 font-medium flex items-center gap-2"
            >
              <span className="text-gray-400">@</span>
              {app.company}
            </motion.p>
          </motion.div>

          <StatusDropdown
            currentStatus={app.status}
            onStatusChange={updateStatus}
          />
        </div>

        {/* Card body with application details */}
        <div className="space-y-3 text-gray-300 mb-6 relative z-10">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2"
          >
            <Calendar size={16} className="text-indigo-400" />
            <span className="opacity-80">Applied:</span>{" "}
            {formatDate(app.dateApplied)}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2"
          >
            <Globe size={16} className="text-indigo-400" />
            <span className="opacity-80">Platform:</span> {app.jobPlatform}
          </motion.div>

          {app.description && (
            <motion.div variants={itemVariants} layout>
              <div
                className="mt-3 pt-3 border-t border-gray-800 relative"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                <motion.p
                  layout
                  className={`text-sm text-gray-400 ${
                    showFullDescription ? "" : "line-clamp-2"
                  } cursor-pointer`}
                >
                  {app.description}
                </motion.p>
                {!showFullDescription && app.description.length > 120 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
                )}
                {app.description.length > 120 && (
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="mt-1 text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Actions section */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {app.jobUrl && (
            <motion.a
              href={app.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-200 rounded-lg text-sm hover:bg-indigo-500/30 transition-all duration-200"
            >
              View Job
              <ExternalLink size={14} />
            </motion.a>
          )}

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2 ml-auto"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onEdit}
                  className="p-2 bg-gray-800/80 text-indigo-400 rounded-full hover:bg-indigo-500/20 transition-all duration-200"
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
                      className="p-2 bg-gray-800/80 text-emerald-400 rounded-full hover:bg-emerald-500/20 transition-all duration-200"
                    >
                      <span className="sr-only">View</span>
                      <Eye size={16} />
                    </motion.button>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() =>
                        handleDownload(
                          app.resumeUrl,
                          `${app.jobTitle}-resume.pdf`
                        )
                      }
                      className="p-2 bg-gray-800/80 text-sky-400 rounded-full hover:bg-sky-500/20 transition-all duration-200"
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
                  className="p-2 bg-gray-800/80 text-red-400 rounded-full hover:bg-red-500/20 transition-all duration-200"
                >
                  <span className="sr-only">Delete</span>
                  <X size={16} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "border-yellow-500/50 text-yellow-200 bg-yellow-500/10";
    case "applied":
      return "border-blue-500/50 text-blue-200 bg-blue-500/10";
    case "interview":
      return "border-orange-500/50 text-orange-200 bg-orange-500/10";
    case "offer":
      return "border-green-500/50 text-green-200 bg-green-500/10";
    case "rejected":
      return "border-red-500/50 text-red-200 bg-red-500/10";
    default:
      return "border-gray-500/50 text-gray-200 bg-gray-500/10";
  }
};

export default ApplicationCard;
