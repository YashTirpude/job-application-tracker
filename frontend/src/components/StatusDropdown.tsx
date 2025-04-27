import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStatusColor } from "./ApplicationCard";

interface StatusDropdownProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const statusOptions = [
    "pending",
    "applied",
    "interview",
    "offer",
    "rejected",
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleStatusChange = (status: string) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />;
      case "applied":
        return <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />;
      case "interview":
        return <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />;
      case "offer":
        return <div className="w-2.5 h-2.5 rounded-full bg-green-400" />;
      case "rejected":
        return <div className="w-2.5 h-2.5 rounded-full bg-red-400" />;
      default:
        return null;
    }
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative z-20">
      {/* Button */}
      <motion.button
        className={`px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold ${getStatusColor(
          currentStatus
        )} text-white shadow-md backdrop-blur-md`}
        onClick={toggleDropdown}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {getStatusIcon(currentStatus)}
        <span className="capitalize">{currentStatus}</span>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="absolute right-0 mt-2 w-48 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30 overflow-hidden"
          >
            <div className="p-2 flex flex-col space-y-1 max-h-60 overflow-y-auto">
              {statusOptions.map((status, index) => (
                <motion.button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full text-left flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition ${
                    currentStatus === status
                      ? `${getStatusColor(status)} text-white`
                      : "hover:bg-white/10 text-white/80"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  {getStatusIcon(status)}
                  <span className="capitalize">{status}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusDropdown;
