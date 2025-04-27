import React from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import {
  updateApplication,
  Application,
} from "../store/slices/applicationSlice";
import StatusDropdown from "./StatusDropdown";
import axios from "axios";

interface ApplicationCardProps {
  application: Application;
  onEdit: () => void;
  onDelete: () => void;
  token: string | null;
}

// Export this function to maintain compatibility with other components
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-gradient-to-r from-yellow-500/50 to-yellow-500/20";
    case "applied":
      return "bg-gradient-to-r from-blue-500/50 to-blue-500/20";
    case "interview":
      return "bg-gradient-to-r from-orange-500/50 to-orange-500/20";
    case "offer":
      return "bg-gradient-to-r from-emerald-500/50 to-emerald-500/20";
    case "rejected":
      return "bg-gradient-to-r from-red-500/50 to-red-500/20";
    default:
      return "bg-gradient-to-r from-gray-500/50 to-gray-500/20";
  }
};

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application: app,
  onEdit,
  onDelete,
  token,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Enhanced animations
  const cardItem = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.6,
        stiffness: 100,
        damping: 15,
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
  };

  const shimmerEffect = {
    hidden: { opacity: 0.5, backgroundPosition: "0% 50%" },
    show: {
      opacity: 1,
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        repeat: Infinity,
        duration: 5,
        ease: "linear",
      },
    },
  };

  const buttonTransition = {
    type: "spring",
    stiffness: 500,
    damping: 25,
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

  // Enhanced status color utilities (for internal use)
  const getEnhancedStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          bg: "bg-gradient-to-r from-yellow-500 to-amber-400",
          border: "border-yellow-500",
          text: "text-yellow-300",
          icon: "🕒",
        };
      case "applied":
        return {
          bg: "bg-gradient-to-r from-blue-500 to-cyan-400",
          border: "border-blue-500",
          text: "text-blue-300",
          icon: "📝",
        };
      case "interview":
        return {
          bg: "bg-gradient-to-r from-orange-500 to-amber-400",
          border: "border-orange-500",
          text: "text-orange-300",
          icon: "👥",
        };
      case "offer":
        return {
          bg: "bg-gradient-to-r from-emerald-500 to-green-400",
          border: "border-emerald-500",
          text: "text-emerald-300",
          icon: "🎉",
        };
      case "rejected":
        return {
          bg: "bg-gradient-to-r from-red-500 to-rose-400",
          border: "border-red-500",
          text: "text-red-300",
          icon: "❌",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-500 to-slate-400",
          border: "border-gray-500",
          text: "text-gray-300",
          icon: "❔",
        };
    }
  };

  const statusInfo = getEnhancedStatusInfo(app.status);

  return (
    <motion.div
      variants={cardItem}
      layoutId={`card-${app._id}`}
      className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300"
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }}
    >
      {/* Glass effect background */}
      <motion.div
        className="absolute inset-0 bg-dark-card/80 backdrop-blur-md border border-dark-border rounded-xl"
        variants={shimmerEffect}
        style={{
          backgroundSize: "200% 200%",
        }}
      />

      {/* Status indicator top bar */}
      <motion.div
        className={`absolute inset-x-0 h-1.5 top-0 ${statusInfo.bg}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />

      <div className="p-6 relative z-10">
        {/* Header with job title and status */}
        <div className="flex justify-between items-start mb-4 gap-4">
          <motion.div className="flex-1 flex flex-col">
            <motion.h2
              className="text-lg font-bold text-white group-hover:text-primary transition-colors duration-300 truncate"
              layoutId={`title-${app._id}`}
            >
              {app.jobTitle}
            </motion.h2>

            <motion.div
              className="mt-1 flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span
                className={`text-sm font-medium ${statusInfo.text} flex items-center gap-1.5`}
              >
                <span>{statusInfo.icon}</span>
                <span className="capitalize">{app.status}</span>
              </span>
            </motion.div>
          </motion.div>

          <StatusDropdown
            currentStatus={app.status}
            onStatusChange={updateStatus}
          />
        </div>

        {/* Company and platform badges */}
        <motion.div
          className="flex flex-wrap items-center gap-2 mb-5"
          layoutId={`company-${app._id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="badge badge-lg bg-dark-hover border-none text-white/90 gap-1">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              🏢
            </motion.span>
            {app.company}
          </span>

          <span className="badge badge-sm bg-dark-hover/50 border-none text-gray-300">
            {app.jobPlatform}
          </span>
        </motion.div>

        {/* Application details timeline */}
        <div className="space-y-3 mb-6">
          <motion.div
            className="flex items-center gap-2 text-sm"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <span className="text-gray-400 font-medium">Applied:</span>
            <span className="text-white">{formatDate(app.dateApplied)}</span>
          </motion.div>

          {app.description && (
            <motion.div
              className="relative pl-4 border-l-2 border-dark-border rounded-r-md overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <p className="text-sm text-gray-300 line-clamp-2 py-1.5">
                {app.description}
              </p>

              {/* Animated highlight gradient on the left border */}
              <motion.div
                className={`absolute inset-y-0 left-[-2px] w-0.5 ${statusInfo.bg}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5 }}
              />
            </motion.div>
          )}
        </div>

        {/* Job link */}
        {app.jobUrl && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href={app.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline border-primary/40 text-primary hover:bg-primary/10 hover:border-primary group/link gap-2"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>View Job Posting</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        )}

        {/* Actions footer */}
        <motion.div
          className="flex justify-between items-center pt-4 border-t border-dark-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="btn btn-sm btn-ghost text-primary hover:bg-primary/10"
            onClick={onEdit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={buttonTransition}
          >
            <motion.span
              className="text-lg"
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.2 }}
            >
              ✎
            </motion.span>
            <span className="ml-1 text-xs font-normal">Edit</span>
          </motion.button>

          <div className="flex gap-2">
            {app.resumeUrl && (
              <>
                <motion.button
                  className="btn btn-circle btn-sm btn-ghost text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => handleView(app.resumeUrl)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={buttonTransition}
                  title="View Resume"
                >
                  <motion.span
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    👁
                  </motion.span>
                </motion.button>

                <motion.button
                  className="btn btn-circle btn-sm btn-ghost text-sky-400 hover:bg-sky-500/10"
                  onClick={() =>
                    handleDownload(app.resumeUrl, `${app.jobTitle}-resume.pdf`)
                  }
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={buttonTransition}
                  title="Download Resume"
                >
                  <motion.span
                    animate={{ y: [0, -2, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    ⭳
                  </motion.span>
                </motion.button>
              </>
            )}

            <motion.button
              className="btn btn-circle btn-sm btn-ghost text-red-400 hover:bg-red-500/10"
              onClick={onDelete}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={buttonTransition}
              title="Delete Application"
            >
              <motion.span
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                ✕
              </motion.span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ApplicationCard;
