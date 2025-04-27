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
      className={`bg-dark-card rounded-xl shadow-md hover:shadow-glow border-l-4 ${getStatusColor(
        app.status
      )} overflow-hidden transition-all duration-300`}
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <motion.h2
            className="text-lg font-semibold text-gray-100 truncate"
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
          className="text-gray-300 font-medium flex items-center gap-2 mb-4"
          layoutId={`company-${app._id}`}
        >
          <span className="text-gray-400">@</span>
          {app.company}
        </motion.p>

        <div className="space-y-3 text-gray-400 text-sm mb-4">
          <p className="flex items-center gap-2">
            <span className="text-indigo-400">•</span>
            Applied: {formatDate(app.dateApplied)}
          </p>

          <p className="flex items-center gap-2">
            <span className="text-indigo-400">•</span>
            {app.jobPlatform}
          </p>

          {app.description && (
            <motion.p
              className="text-xs text-gray-500 line-clamp-2 mt-2 pl-4 border-l-2 border-gray-700"
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg text-sm hover:bg-gray-800 hover:text-gray-100 transition-all duration-200"
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
          >
            View Job
            <span className="text-indigo-400">→</span>
          </motion.a>
        )}

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-800">
          <motion.button
            className="p-2 bg-gray-800/50 text-indigo-400 rounded-full hover:bg-gray-800 hover:shadow-glow-sm transition-all duration-200"
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
                  className="p-2 bg-gray-800/50 text-emerald-400 rounded-full hover:bg-gray-800 hover:shadow-glow-sm transition-all duration-200"
                  onClick={() => handleView(app.resumeUrl)}
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  title="View Resume"
                >
                  <span className="sr-only">View</span>
                  👁
                </motion.button>

                <motion.button
                  className="p-2 bg-gray-800/50 text-sky-400 rounded-full hover:bg-gray-800 hover:shadow-glow-sm transition-all duration-200"
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
              className="p-2 bg-gray-800/50 text-red-400 rounded-full hover:bg-gray-800 hover:shadow-glow-sm transition-all duration-200"
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
