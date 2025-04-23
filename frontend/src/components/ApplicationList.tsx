import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { AppDispatch, RootState } from "../store";
import {
  deleteApplication,
  getApplications,
  setApplications,
  Application,
  updateApplication,
} from "../store/slices/applicationSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ApplicationList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const statusOptions = [
    "pending",
    "applied",
    "interview",
    "offer",
    "rejected",
  ];

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);

  const { token } = useSelector((state: RootState) => state.auth);
  const { applications, loading, error, hasNextPage } = useSelector(
    (state: RootState) => state.applications
  );

  const uniqueApplications = Array.from(
    new Map(applications.map((app) => [app._id, app])).values()
  );

  const filteredApplications = selectedFilter
    ? uniqueApplications.filter((app) => app.status === selectedFilter)
    : uniqueApplications;

  useEffect(() => {
    if (token) {
      dispatch(getApplications({ page, limit: 10 }));
    }
  }, [dispatch, token, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loaderRef.current;

    if (currentRef && hasNextPage) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, loading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        !(event.target as Element).closest(".status-dropdown")
      ) {
        setIsDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleCreateClick = () => {
    navigate("/create");
  };

  const handleEditClick = (id: string) => {
    navigate(`/applications/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (token && deleteId) {
      dispatch(deleteApplication({ id: deleteId, token })).then(() => {
        setPage(1);
        dispatch(setApplications([]));
        dispatch(getApplications({ page: 1, limit: 10 }));
      });
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "border-l-amber-400 bg-amber-500/10";
      case "applied":
        return "border-l-indigo-500 bg-indigo-500/10";
      case "interview":
        return "border-l-orange-500 bg-orange-500/10";
      case "offer":
        return "border-l-emerald-500 bg-emerald-500/10";
      case "rejected":
        return "border-l-rose-500 bg-rose-500/10";
      default:
        return "border-l-gray-500 bg-gray-500/10";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-amber-400";
      case "applied":
        return "text-indigo-400";
      case "interview":
        return "text-orange-400";
      case "offer":
        return "text-emerald-400";
      case "rejected":
        return "text-rose-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "applied":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "interview":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "offer":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "rejected":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        ease: "easeOut",
      },
    },
  };

  const cardItem = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  function objectToFormData(obj: Record<string, any>) {
    const formData = new FormData();
    for (const key in obj) {
      formData.append(key, obj[key]);
    }
    return formData;
  }

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear",
            }}
          />
          <p className="text-lg font-medium text-gray-200">
            Loading applications...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900">
        <motion.div
          className="max-w-md p-6 bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl border border-rose-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <svg
              className="h-8 w-8 text-rose-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-lg font-medium text-rose-300">
              Error: {error}
            </span>
          </div>
          <motion.button
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
            onClick={() => dispatch(getApplications({ page: 1, limit: 10 }))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12 text-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 mb-10 bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
              Applications
            </h1>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-semibold">
              {uniqueApplications.length}
            </span>
          </motion.div>
          <motion.button
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl flex items-center gap-2"
            onClick={handleCreateClick}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Application
          </motion.button>
        </motion.div>

        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-indigo-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-200">
                Filter by Status
              </h2>
            </div>
            {selectedFilter && (
              <motion.button
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                onClick={() => setSelectedFilter(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Clear
              </motion.button>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-gray-900 to-transparent z-10 rounded-l-xl" />
            <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-gray-900 to-transparent z-10 rounded-r-xl" />
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-2 border border-gray-700/20">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                <motion.div
                  className="flex gap-2 min-w-max"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <motion.button
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${
                      !selectedFilter
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() => setSelectedFilter(null)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">
                      {uniqueApplications.length}
                    </span>
                    All
                  </motion.button>
                  {statusOptions.map((status, index) => {
                    const count = uniqueApplications.filter(
                      (app) => app.status.toLowerCase() === status.toLowerCase()
                    ).length;
                    return (
                      <motion.button
                        key={status}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${
                          selectedFilter === status
                            ? `bg-gradient-to-r ${getStatusColor(status)
                                .replace("border-l-", "from-")
                                .replace(" bg-", " to-")} text-white shadow-md`
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600"
                        }`}
                        onClick={() => setSelectedFilter(status)}
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          show: { opacity: 1, y: 0 },
                        }}
                        initial="hidden"
                        animate="show"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            selectedFilter === status
                              ? "bg-white/20"
                              : "bg-gray-600/50"
                          }`}
                        >
                          {count}
                        </span>
                        <span className="capitalize flex items-center gap-1">
                          <span className={getStatusTextColor(status)}>
                            {getStatusIcon(status)}
                          </span>
                          {status}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {filteredApplications.length === 0 ? (
          <motion.div
            className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl text-center max-w-lg mx-auto border border-gray-700/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.svg
              className="h-16 w-16 text-gray-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </motion.svg>
            <p className="text-lg text-gray-300 mb-4">
              {selectedFilter
                ? `No ${selectedFilter} applications found.`
                : "No applications yet. Create one to get started!"}
            </p>
            <motion.button
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              onClick={handleCreateClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Application
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={container}
            initial="hidden"
            animate="show"
            key={selectedFilter || "all"}
          >
            <AnimatePresence>
              {filteredApplications.map((app: Application) => (
                <motion.div
                  key={app._id}
                  variants={cardItem}
                  className={`relative bg-gray-800/70 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden ${getStatusColor(
                    app.status
                  )} group`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg font-bold text-gray-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {app.jobTitle}
                      </h2>
                      <div className="relative status-dropdown">
                        <label
                          tabIndex={0}
                          className={`px-2.5 py-1.5 flex items-center gap-1.5 text-sm font-medium ${getStatusTextColor(
                            app.status
                          )} rounded-md hover:bg-gray-700/50 cursor-pointer`}
                          onClick={() =>
                            setIsDropdownOpen(
                              isDropdownOpen === app._id ? null : app._id
                            )
                          }
                        >
                          {getStatusIcon(app.status)}
                          <span className="capitalize">{app.status}</span>
                        </label>
                        {isDropdownOpen === app._id && (
                          <motion.ul
                            tabIndex={0}
                            className="absolute right-0 mt-2 p-2 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl w-40 z-10 border border-gray-700/30"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            {statusOptions.map((status) => (
                              <li key={status}>
                                <button
                                  onClick={() => {
                                    dispatch(
                                      updateApplication({
                                        id: app._id,
                                        formData: objectToFormData({ status }),
                                        token: token!,
                                      })
                                    );
                                    setIsDropdownOpen(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm capitalize ${getStatusTextColor(
                                    status
                                  )} hover:bg-gray-700/50 rounded-md flex items-center gap-2`}
                                >
                                  {getStatusIcon(status)}
                                  {status}
                                </button>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 font-medium flex items-center gap-2 mb-3">
                      <svg
                        className="h-4 w-4 text-gray-400"
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
                    </p>
                    <div className="text-sm text-gray-400 space-y-2">
                      <p className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(app.dateApplied)}
                      </p>
                      <p className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        {app.jobPlatform}
                      </p>
                      {app.description && (
                        <p className="line-clamp-2 text-gray-500">
                          {app.description}
                        </p>
                      )}
                    </div>
                    {app.jobUrl && (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1.5 mt-3"
                      >
                        View Job
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                      {app.resumeUrl && (
                        <>
                          <motion.button
                            className="p-2 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white rounded-full"
                            onClick={() => handleView(app.resumeUrl)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="View resume"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </motion.button>
                          <motion.button
                            className="p-2 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-full"
                            onClick={() =>
                              handleDownload(
                                app.resumeUrl,
                                `${app.jobTitle}-resume.pdf`
                              )
                            }
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Download resume"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </motion.button>
                        </>
                      )}
                      <motion.button
                        className="p-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-full"
                        onClick={() => handleEditClick(app._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit application"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </motion.button>
                      <motion.button
                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-full"
                        onClick={() => handleDeleteClick(app._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete application"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {hasNextPage && (
          <motion.div
            ref={loaderRef}
            className="flex justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                />
                <p className="text-gray-400 text-sm">Loading more...</p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Scroll to load more...</p>
            )}
          </motion.div>
        )}

        {!hasNextPage && uniqueApplications.length > 0 && (
          <motion.div
            className="flex justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="px-4 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
              No more applications
            </span>
          </motion.div>
        )}

        <AnimatePresence>
          {deleteId && (
            <motion.div
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-xl border border-gray-700/30"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-gray-100 mb-4">
                  Delete Application
                </h3>
                <p className="text-gray-300 mb-4">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <motion.button
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    onClick={confirmDelete}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg"
                    onClick={cancelDelete}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ApplicationList;
