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
      className={`group relative bg-dark-card/80 backdrop-blur-sm rounded-xl border border-dark-border overflow-hidden transition-all duration-300`}
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }}
    >
      {/* Status Indicator */}
      <div
        className={`absolute inset-x-0 h-1 top-0 ${getStatusColor(app.status)}`}
      />

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <motion.h2
            className="text-lg font-semibold text-gray-100 truncate group-hover:text-primary transition-colors duration-300"
            layoutId={`title-${app._id}`}
          >
            {app.jobTitle}
          </motion.h2>
          <StatusDropdown
            currentStatus={app.status}
            onStatusChange={updateStatus}
          />
        </div>

        <motion.div
          className="flex items-center gap-3 mb-4"
          layoutId={`company-${app._id}`}
        >
          <span className="px-3 py-1 bg-dark-hover rounded-full text-gray-300 text-sm">
            {app.company}
          </span>
          <span className="px-2 py-1 bg-dark-hover rounded-full text-xs text-gray-400">
            {app.jobPlatform}
          </span>
        </motion.div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-primary/50" />
            <span className="text-gray-400">Applied:</span>
            <span className="text-gray-300">{formatDate(app.dateApplied)}</span>
          </div>

          {app.description && (
            <motion.div
              className="relative pl-4 border-l-2 border-dark-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-gray-400 line-clamp-2">
                {app.description}
              </p>
              <div className="absolute inset-y-0 left-[-2px] w-[2px] bg-gradient-to-b from-primary/50 to-transparent" />
            </motion.div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {app.jobUrl && (
            <motion.a
              href={app.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-dark-hover rounded-lg text-sm text-gray-300 hover:text-primary transition-all duration-200 group/link"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              View Job
              <span className="text-primary group-hover/link:translate-x-1 transition-transform duration-200">
                →
              </span>
            </motion.a>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-dark-border">
          <motion.button
            className="p-2.5 bg-dark-hover text-primary rounded-lg hover:bg-primary/10 transition-all duration-200"
            onClick={onEdit}
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <span className="sr-only">Edit</span>✎
          </motion.button>

          <div className="flex gap-2">
            {app.resumeUrl && (
              <>
                <motion.button
                  className="p-2.5 bg-dark-hover text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-all duration-200"
                  onClick={() => handleView(app.resumeUrl)}
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  title="View Resume"
                >
                  <span className="sr-only">View</span>
                  👁
                </motion.button>

                <motion.button
                  className="p-2.5 bg-dark-hover text-sky-400 rounded-lg hover:bg-sky-500/10 transition-all duration-200"
                  onClick={() =>
                    handleDownload(app.resumeUrl, `${app.jobTitle}-resume.pdf`)
                  }
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  title="Download Resume"
                >
                  <span className="sr-only">Download</span>⭳
                </motion.button>
              </>
            )}

            <motion.button
              className="p-2.5 bg-dark-hover text-red-400 rounded-lg hover:bg-red-500/10 transition-all duration-200"
              onClick={onDelete}
              whileHover={buttonHover}
              whileTap={buttonTap}
              title="Delete Application"
            >
              <span className="sr-only">Delete</span>✕
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

export default ApplicationCard;
