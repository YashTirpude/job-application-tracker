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
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 18,
        duration: 0.4,
      },
    },
    hover: {
      scale: 1.03,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 10,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
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

  const getStatusColors: Record<string, string> = {
    pending: "from-yellow-400 via-yellow-500 to-yellow-600",
    applied: "from-blue-400 via-blue-500 to-blue-600",
    interview: "from-orange-400 via-orange-500 to-orange-600",
    offer: "from-green-400 via-green-500 to-green-600",
    rejected: "from-red-400 via-red-500 to-red-600",
    default: "from-gray-400 via-gray-500 to-gray-600",
  };

  const getStatusGradient = (status: string) =>
    getStatusColors[status.toLowerCase()] || getStatusColors.default;

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
      className={`rounded-2xl p-6 bg-gradient-to-br ${getStatusGradient(
        app.status
      )} text-white shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-white opacity-5 blur-2xl rounded-2xl pointer-events-none"
      />

      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">{app.jobTitle}</h2>
          <p className="text-sm opacity-80">@ {app.company}</p>
        </div>
        <StatusDropdown
          currentStatus={app.status}
          onStatusChange={updateStatus}
        />
      </div>

      <div className="space-y-3 text-sm mb-6">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          Applied: {formatDate(app.dateApplied)}
        </div>
        <div className="flex items-center gap-2">
          <Globe size={16} />
          Platform: {app.jobPlatform}
        </div>

        {app.description && (
          <div
            className="relative mt-2"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            <p
              className={`cursor-pointer ${
                showFullDescription ? "" : "line-clamp-2"
              }`}
            >
              {app.description}
            </p>
            {app.description.length > 120 && (
              <button className="text-xs underline mt-1">
                {showFullDescription ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {app.jobUrl && (
          <motion.a
            href={app.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 text-xs backdrop-blur"
          >
            View Job <ExternalLink size={14} />
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
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={onEdit}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
              >
                <FileEdit size={16} />
              </motion.button>

              {app.resumeUrl && (
                <>
                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleView(app.resumeUrl)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
                  >
                    <Eye size={16} />
                  </motion.button>

                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() =>
                      handleDownload(
                        app.resumeUrl,
                        `${app.jobTitle}-resume.pdf`
                      )
                    }
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
                  >
                    <Download size={16} />
                  </motion.button>
                </>
              )}

              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={onDelete}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-red-300"
              >
                <X size={16} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// 👉👉 THIS is the key export you need
export const getStatusColor = (status: string) =>
  `bg-gradient-to-br ${
    {
      pending: "from-yellow-400 via-yellow-500 to-yellow-600",
      applied: "from-blue-400 via-blue-500 to-blue-600",
      interview: "from-orange-400 via-orange-500 to-orange-600",
      offer: "from-green-400 via-green-500 to-green-600",
      rejected: "from-red-400 via-red-500 to-red-600",
      default: "from-gray-400 via-gray-500 to-gray-600",
    }[status.toLowerCase()] || "from-gray-400 via-gray-500 to-gray-600"
  }`;

export default ApplicationCard;
