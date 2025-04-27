import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Calendar, Award, X as XIcon } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusIcon = (status: string) => {
    const iconProps = { size: 14, className: "stroke-current" };

    switch (status.toLowerCase()) {
      case "pending":
        return <Clock {...iconProps} />;
      case "applied":
        return <CheckCircle2 {...iconProps} />;
      case "interview":
        return <Calendar {...iconProps} />;
      case "offer":
        return <Award {...iconProps} />;
      case "rejected":
        return <XIcon {...iconProps} />;
      default:
        return null;
    }
  };

  const getStatusColors = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          text: "text-yellow-200",
          ring: "ring-yellow-500/30",
          shadow: "shadow-yellow-500/20",
        };
      case "applied":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          text: "text-blue-200",
          ring: "ring-blue-500/30",
          shadow: "shadow-blue-500/20",
        };
      case "interview":
        return {
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          text: "text-orange-200",
          ring: "ring-orange-500/30",
          shadow: "shadow-orange-500/20",
        };
      case "offer":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          text: "text-green-200",
          ring: "ring-green-500/30",
          shadow: "shadow-green-500/20",
        };
      case "rejected":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-200",
          ring: "ring-red-500/30",
          shadow: "shadow-red-500/20",
        };
      default:
        return {
          bg: "bg-gray-500/10",
          border: "border-gray-500/30",
          text: "text-gray-200",
          ring: "ring-gray-500/30",
          shadow: "shadow-gray-500/20",
        };
    }
  };

  const colors = getStatusColors(status);

  return (
    <motion.div
      className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium ${colors.bg} ${colors.text} ring-1 ${colors.ring} shadow-sm ${colors.shadow}`}
      whileHover={{
        scale: 1.05,
        boxShadow: `0 0 12px 0 ${colors.shadow
          .replace("shadow-", "")
          .replace("/20", "/40")}`,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 10,
      }}
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center"
      >
        {getStatusIcon(status)}
      </motion.span>
      <span className="capitalize">{status}</span>
    </motion.div>
  );
};

export default StatusBadge;
