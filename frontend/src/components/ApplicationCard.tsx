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
    hidden: { opacity: 0, y: 50, scale: 0.85 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.5,
        stiffness: 200,
        damping: 20,
        delayChildren: 0.1,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: 30,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    hover: {
      y: -12,
      scale: 1.05,
      boxShadow: "0 20px 50px rgba(0, 255, 255, 0.5)",
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: 8,
      transition: {
        type: "spring",
        stiffness: 800,
        damping: 12,
      },
    },
    tap: {
      scale: 0.85,
      rotate: -8,
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

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          border: "border-[#FFFF00]",
          bg: "bg-[#FFFF00]/20",
          text: "text-[#FFFF00]",
          glow: "shadow-[#FFFF00]/40",
          ring: "ring-[#FFFF00]/30",
          hover: "hover:bg-[#FFFF00]/30",
          gradient: "from-[#FFFF00]/20 to-[#FFAA00]/20",
        };
      case "applied":
        return {
          border: "border-[#00FFFF]",
          bg: "bg-[#00FFFF]/20",
          text: "text-[#00FFFF]",
          glow: "shadow-[#00FFFF]/40",
          ring: "ring-[#00FFFF]/30",
          hover: "hover:bg-[#00FFFF]/30",
          gradient: "from-[#00FFFF]/20 to-[#00AAFF]/20",
        };
      case "interview":
        return {
          border: "border-[#FF6600]",
          bg: "bg-[#FF6600]/20",
          text: "text-[#FF6600]",
          glow: "shadow-[#FF6600]/40",
          ring: "ring-[#FF6600]/30",
          hover: "hover:bg-[#FF6600]/30",
          gradient: "from-[#FF6600]/20 to-[#FF3300]/20",
        };
      case "offer":
        return {
          border: "border-[#00FF00]",
          bg: "bg-[#00FF00]/20",
          text: "text-[#00FF00]",
          glow: "shadow-[#00FF00]/40",
          ring: "ring-[#00FF00]/30",
          hover: "hover:bg-[#00FF00]/30",
          gradient: "from-[#00FF00]/20 to-[#00CC00]/20",
        };
      case "rejected":
        return {
          border: "border-[#FF0000]",
          bg: "bg-[#FF0000]/20",
          text: "text-[#FF0000]",
          glow: "shadow-[#FF0000]/40",
          ring: "ring-[#FF0000]/30",
          hover: "hover:bg-[#FF0000]/30",
          gradient: "from-[#FF0000]/20 to-[#CC0000]/20",
        };
      default:
        return {
          border: "border-[#FF00FF]",
          bg: "bg-[#FF00FF]/20",
          text: "text-[#FF00FF]",
          glow: "shadow-[#FF00FF]/40",
          ring: "ring-[#FF00FF]/30",
          hover: "hover:bg-[#FF00FF]/30",
          gradient: "from-[#FF00FF]/20 to-[#CC00CC]/20",
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
      className={`relative bg-gradient-to-br ${statusStyles.gradient} backdrop-blur-2xl rounded-3xl overflow-hidden ${statusStyles.border} border-4 ${statusStyles.glow} transition-all duration-300`}
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Dynamic neon glow effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-0 rounded-3xl"
        style={{
          background: `radial-gradient(circle at 130% 20%, ${statusStyles.bg
            .replace("bg-", "")
            .replace("/20", "")}, transparent 60%)`,
          filter: "blur(30px)",
        }}
      />

      {/* Animated border pulse */}
      <motion.div
        className={`absolute inset-0 ${statusStyles.ring} rounded-3xl`}
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="p-8 relative z-10">
        {/* Card header */}
        <div className="flex justify-between items-start mb-8">
          <motion.div variants={itemVariants} className="flex-1 mr-6">
            <motion.h2
              layoutId={`title-${app._id}`}
              className="text-3xl font-extrabold text-white tracking-wide truncate hover:text-[#FF00FF] transition-colors duration-200"
            >
              {app.jobTitle}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-[#00FFFF] font-bold flex items-center gap-3 mt-2 text-lg"
            >
              <span className="text-[#00FFFF]/50">@</span>
              {app.company}
            </motion.p>
          </motion.div>

          <StatusDropdown
            currentStatus={app.status}
            onStatusChange={updateStatus}
          />
        </div>

        {/* Card body */}
        <div className="space-y-6 text-gray-100 mb-8">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 text-base"
          >
            <Calendar size={20} className="text-[#FFFF00]" />
            <span className="opacity-70 font-medium">Applied:</span>{" "}
            {formatDate(app.dateApplied)}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 text-base"
          >
            <Globe size={20} className="text-[#FFFF00]" />
            <span className="opacity-70 font-medium">Platform:</span>{" "}
            {app.jobPlatform}
          </motion.div>

          {app.description && (
            <motion.div variants={itemVariants} layout>
              <div
                className="mt-6 pt-6 border-t border-gray-600/30"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                <motion.p
                  layout
                  className={`text-base text-gray-200 ${
                    showFullDescription ? "" : "line-clamp-3"
                  } cursor-pointer hover:text-[#00FF00] transition-colors duration-200`}
                >
                  {app.description}
                </motion.p>
                {!showFullDescription && app.description.length > 150 && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900/95 to-transparent pointer-events-none"></div>
                )}
                {app.description.length > 150 && (
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="mt-3 text-sm text-[#00FFFF] hover:text-[#00FFFF]/70 font-medium transition-colors duration-200"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Actions section */}
        <div className="flex flex-wrap items-center gap-4">
          {app.jobUrl && (
            <motion.a
              href={app.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className={`inline-flex items-center gap-2 px-6 py-3 bg-[#FF00FF]/30 text-[#FF00FF] rounded-xl text-base font-semibold ${statusStyles.hover} transition-all duration-300`}
            >
              View Job
              <ExternalLink size={18} />
            </motion.a>
          )}

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex gap-3 ml-auto"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onEdit}
                  className="p-3 bg-gray-900/50 text-[#00FFFF] rounded-full hover:bg-[#00FFFF]/30 transition-all duration-300"
                >
                  <span className="sr-only">Edit</span>
                  <FileEdit size={18} />
                </motion.button>

                {app.resumeUrl && (
                  <>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleView(app.resumeUrl)}
                      className="p-3 bg-gray-900/50 text-[#00FF00] rounded-full hover:bg-[#00FF00]/30 transition-all duration-300"
                    >
                      <span className="sr-only">View</span>
                      <Eye size={18} />
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
                      className="p-3 bg-gray-900/50 text-[#FFFF00] rounded-full hover:bg-[#FFFF00]/30 transition-all duration-300"
                    >
                      <span className="sr-only">Download</span>
                      <Download size={18} />
                    </motion.button>
                  </>
                )}

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onDelete}
                  className="p-3 bg-gray-900/50 text-[#FF0000] rounded-full hover:bg-[#FF0000]/30 transition-all duration-300"
                >
                  <span className="sr-only">Delete</span>
                  <X size={18} />
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
      return "border-[#FFFF00] text-[#FFFF00] bg-[#FFFF00]/20";
    case "applied":
      return "border-[#00FFFF] text-[#00FFFF] bg-[#00FFFF]/20";
    case "interview":
      return "border-[#FF6600] text-[#FF6600] bg-[#FF6600]/20";
    case "offer":
      return "border-[#00FF00] text-[#00FF00] bg-[#00FF00]/20";
    case "rejected":
      return "border-[#FF0000] text-[#FF0000] bg-[#FF0000]/20";
    default:
      return "border-[#FF00FF] text-[#FF00FF] bg-[#FF00FF]/20";
  }
};

export default ApplicationCard;
