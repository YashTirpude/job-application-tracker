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
        return "border-l-amber-400 text-amber-600 bg-amber-50";
      case "applied":
        return "border-l-sky-400 text-sky-600 bg-sky-50";
      case "interview":
        return "border-l-orange-400 text-orange-600 bg-orange-50";
      case "offer":
        return "border-l-emerald-400 text-emerald-600 bg-emerald-50";
      case "rejected":
        return "border-l-rose-400 text-rose-600 bg-rose-50";
      default:
        return "border-l-gray-400 text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
        staggerChildren: 0.2,
        ease: "easeOut",
      },
    },
  };

  const cardItem = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const buttonHover = {
    scale: 1.1,
    transition: { duration: 0.3, ease: "easeOut" },
  };

  const buttonTap = {
    scale: 0.9,
    transition: { duration: 0.2, ease: "easeIn" },
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          className="text-center space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "linear",
            }}
          />
          <p className="text-xl font-medium text-indigo-700">
            Loading applications...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-red-200"
        variants={fadeInUp}
        initial="hidden"
        animate="show"
      >
        <div className="flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-500"
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
          <p className="text-lg font-semibold text-red-600">{error}</p>
        </div>
        <motion.button
          className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors duration-300"
          onClick={() => dispatch(getApplications({ page: 1, limit: 10 }))}
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          Retry
        </motion.button>
      </motion.div>
    );
  }

  function objectToFormData(obj: Record<string, any>) {
    const formData = new FormData();
    for (const key in obj) {
      formData.append(key, obj[key]);
    }
    return formData;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 shadow-2xl text-white"
          variants={fadeInUp}
          initial="hidden"
          animate="show"
        >
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Job Applications
            </h1>
            <motion.span
              className="px-4 py-1 bg-white/20 rounded-full text-sm font-semibold"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {uniqueApplications.length}
            </motion.span>
          </div>
          <motion.button
            className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold shadow-lg hover:bg-indigo-100 transition-colors duration-300 flex items-center gap-2"
            onClick={handleCreateClick}
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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

        {/* Filter Section */}
        <motion.div
          className="mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="show"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-800">
                Filter by Status
              </h2>
            </div>
            {selectedFilter && (
              <motion.button
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 font-medium"
                onClick={() => setSelectedFilter(null)}
                whileHover={{ scale: 1.05, x: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Clear Filter
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              </motion.button>
            )}
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex overflow-x-auto gap-3 scrollbar-hide">
              <motion.button
                className={`px-5 py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-300 ${
                  !selectedFilter
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedFilter(null)}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <span className="bg-white/30 rounded-full w-7 h-7 flex items-center justify-center text-xs font-semibold">
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
                    className={`px-5 py-2 rounded-xl font-medium text-sm flex items-center gap-2 capitalize transition-all duration-300 ${
                      selectedFilter === status
                        ? `${getStatusColor(status)} shadow-md`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedFilter(status)}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <span className="bg-white/30 rounded-full w-7 h-7 flex items-center justify-center text-xs font-semibold">
                      {count}
                    </span>
                    {getStatusIcon(status)}
                    {status}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Application Cards */}
        {filteredApplications.length === 0 ? (
          <motion.div
            className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto shadow-xl border border-gray-100"
            variants={fadeInUp}
            initial="hidden"
            animate="show"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mx-auto mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </motion.svg>
            <p className="text-xl font-medium text-gray-700 mb-6">
              {selectedFilter
                ? `No ${selectedFilter} applications found.`
                : "No applications found. Start by creating one!"}
            </p>
            <motion.button
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors duration-300"
              onClick={handleCreateClick}
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              Create Application
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {filteredApplications.map((app: Application) => (
                <motion.div
                  key={app._id}
                  variants={cardItem}
                  className={`bg-white rounded-2xl shadow-lg border-l-8 ${getStatusColor(
                    app.status
                  )} overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-gray-800 truncate">
                        {app.jobTitle}
                      </h2>
                      <div className="dropdown dropdown-end">
                        <label
                          tabIndex={0}
                          className={`px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {getStatusIcon(app.status)}
                          <span className="capitalize">{app.status}</span>
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu p-3 shadow-xl bg-white rounded-lg w-48 mt-2 border border-gray-100"
                        >
                          {statusOptions.map((status) => (
                            <li key={status}>
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateApplication({
                                      id: app._id,
                                      formData: objectToFormData({ status }),
                                      token: token!,
                                    })
                                  )
                                }
                                className={`capitalize flex items-center gap-3 ${getStatusColor(
                                  status
                                )} hover:bg-gray-100 rounded-lg py-2 px-4 transition-colors duration-200`}
                              >
                                {getStatusIcon(status)}
                                {status}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="text-gray-800 font-semibold flex items-center gap-2 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 2025h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {app.company}
                    </p>
                    <div className="space-y-3 text-gray-600">
                      <p className="flex items-center gap-2 text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
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
                        Applied: {formatDate(app.dateApplied)}
                      </p>
                      <p className="flex items-center gap-2 text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
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
                        <p className="text-sm text-gray-500 line-clamp-2 bg-gray-50 p-3 rounded-lg">
                          {app.description}
                        </p>
                      )}
                    </div>
                    {app.jobUrl && (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 flex items-center gap-2 mt-4 hover:text-indigo-800 transition-colors duration-300"
                      >
                        View Job
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
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
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                      <motion.button
                        className="p-3 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors duration-300"
                        onClick={() => handleEditClick(app._id)}
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
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
                      <div className="flex gap-3">
                        {app.resumeUrl && (
                          <>
                            <motion.button
                              className="p-3 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors duration-300"
                              onClick={() => handleView(app.resumeUrl)}
                              whileHover={buttonHover}
                              whileTap={buttonTap}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
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
                              className="p-3 bg-sky-50 text-sky-600 rounded-full hover:bg-sky-100 transition-colors duration-300"
                              onClick={() =>
                                handleDownload(
                                  app.resumeUrl,
                                  `${app.jobTitle}-resume.pdf`
                                )
                              }
                              whileHover={buttonHover}
                              whileTap={buttonTap}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
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
                          className="p-3 bg-rose-50 text-rose-600 rounded-full hover:bg-rose-100 transition-colors duration-300"
                          onClick={() => handleDeleteClick(app._id)}
                          whileHover={buttonHover}
                          whileTap={buttonTap}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
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
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Infinite Scroll Loader */}
        {hasNextPage && (
          <motion.div
            ref={loaderRef}
            className="flex justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "linear",
                  }}
                />
                <p className="text-gray-700 font-medium">Loading more...</p>
              </div>
            ) : (
              <p className="text-gray-700 font-medium">
                Scroll to load more...
              </p>
            )}
          </motion.div>
        )}

        {!hasNextPage && uniqueApplications.length > 0 && (
          <motion.div
            className="flex justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="px-6 py-3 bg-white rounded-xl text-gray-700 font-medium shadow-md">
              That's all for now!
            </p>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteId && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100"
                initial={{ scale: 0.8, opacity: 0, rotateX: 10 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateX: 10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                  Confirm Deletion
                </h3>
                <div className="text-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-rose-500 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-lg text-gray-700">
                    Are you sure you want to delete this application?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This action is permanent.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <motion.button
                    className="px-6 py-2 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition-colors duration-300"
                    onClick={confirmDelete}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    Delete
                  </motion.button>
                  <motion.button
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300"
                    onClick={cancelDelete}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
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
