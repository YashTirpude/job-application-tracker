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
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.8,
        stiffness: 120,
        damping: 15,
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: "0 15px 40px rgba(0, 255, 255, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.15,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 10,
      },
    },
    tap: {
      scale: 0.9,
      rotate: -5,
      transition: {
        duration: 0.15,
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

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          border: "border-neon-yellow",
          bg: "bg-neon-yellow/10",
          text: "text-neon-yellow",
          glow: "shadow-neon-yellow/30",
          ring: "ring-neon-yellow/20",
          hover: "hover:bg-neon-yellow/20",
        };
      case "applied":
        return {
          border: "border-neon-blue",
          bg: "bg-neon-blue/10",
          text: "text-neon-blue",
          glow: "shadow-neon-blue/30",
          ring: "ring-neon-blue/20",
          hover: "hover:bg-neon-blue/20",
        };
      case "interview":
        return {
          border: "border-neon-orange",
          bg: "bg-neon-orange/10",
          text: "text-neon-orange",
          glow: "shadow-neon-orange/30",
          ring: "ring-neon-orange/20",
          hover: "hover:bg-neon-orange/20",
        };
      case "offer":
        return {
          border: "border-neon-green",
          bg: "bg-neon-green/10",
          text: "text-neon-green",
          glow: "shadow-neon-green/30",
          ring: "ring-neon-green/20",
          hover: "hover:bg-neon-green/20",
        };
      case "rejected":
        return {
          border: "border-neon-red",
          bg: "bg-neon-red/10",
          text: "text-neon-red",
          glow: "shadow-neon-red/30",
          ring: "ring-neon-red/20",
          hover: "hover:bg-neon-red/20",
        };
      default:
        return {
          border: "border-neon-purple",
          bg: "bg-neon-purple/10",
          text: "text-neon-purple",
          glow: "shadow-neon-purple/30",
          ring: "ring-neon-purple/20",
          hover: "hover:bg-neon-purple/20",
        };
    }
  };

  const statusStyles = getStatusStyles(app.status);

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
      className={`relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden ${statusStyles.border} border-2 ${statusStyles.glow} transition-all duration-500`}
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Neon glow effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(circle at 150% 30%, ${statusStyles.bg
            .replace("bg-", "")
            .replace("/10", "")}, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      <div className="p-6 relative z-10">
        {/* Card header */}
        <div className="flex justify-between items-start mb-6">
          <motion.div variants={itemVariants} className="flex-1 mr-4">
            <motion.h2
              layoutId={`title-${app._id}`}
              className="text-2xl font-bold text-white tracking-tight truncate hover:text-neon-pink transition-colors duration-300"
            >
              {app.jobTitle}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-neon-purple font-semibold flex items-center gap-2 mt-1"
            >
              <span className="text-neon-purple/60">@</span>
              {app.company}
            </motion.p>
          </motion.div>

          <StatusDropdown
            currentStatus={app.status}
            onStatusChange={updateStatus}
          />
        </div>

        {/* Card body */}
        <div className="space-y-4 text-gray-200 mb-6">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 text-sm"
          >
            <Calendar size={18} className="text-neon-blue" />
            <span className="opacity-80">Applied:</span>{" "}
            {formatDate(app.dateApplied)}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 text-sm"
          >
            <Globe size={18} className="text-neon-blue" />
            <span className="opacity-80">Platform:</span> {app.jobPlatform}
          </motion.div>

          {app.description && (
            <motion.div variants={itemVariants} layout>
              <div
                className="mt-4 pt-4 border-t border-gray-700/50"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                <motion.p
                  layout
                  className={`text-sm text-gray-300 ${
                    showFullDescription ? "" : "line-clamp-3"
                  } cursor-pointer hover:text-neon-green transition-colors duration-200`}
                >
                  {app.description}
                </motion.p>
                {!showFullDescription && app.description.length > 150 && (
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-900/90 to-transparent pointer-events-none"></div>
                )}
                {app.description.length > 150 && (
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="mt-2 text-xs text-neon-blue hover:text-neon-blue/80 transition-colors duration-200"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Actions section */}
        <div className="flex flex-wrap items-center gap-3">
          {app.jobUrl && (
            <motion.a
              href={app.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className={`inline-flex items-center gap-2 px-4 py-2 bg-neon-pink/20 text-neon-pink rounded-xl text-sm ${statusStyles.hover} font-medium transition-all duration-300`}
            >
              View Job
              <ExternalLink size={16} />
            </motion.a>
          )}

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex gap-2 ml-auto"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onEdit}
                  className="p-2 bg-gray-800/60 text-neon-blue rounded-full hover:bg-neon-blue/20 transition-all duration-300"
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
                      className="p-2 bg-gray-800/60 text-neon-green rounded-full hover:bg-neon-green/20 transition-all duration-300"
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
                      className="p-2 bg-gray-800/60 text-neon-yellow rounded-full hover:bg-neon-yellow/20 transition-all duration-300"
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
                  className="p-2 bg-gray-800/60 text-neon-red rounded-full hover:bg-neon-red/20 transition-all duration-300"
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
      return "border-neon-yellow text-neon-yellow bg-neon-yellow/10";
    case "applied":
      return "border-neon-blue text-neon-blue bg-neon-blue/10";
    case "interview":
      return "border-neon-orange text-neon-orange bg-neon-orange/10";
    case "offer":
      return "border-neon-green text-neon-green bg-neon-green/10";
    case "rejected":
      return "border-neon-red text-neon-red bg-neon-red/10";
    default:
      return "border-neon-purple text-neon-purple bg-neon-purple/10";
  }
};

export default ApplicationCard;
