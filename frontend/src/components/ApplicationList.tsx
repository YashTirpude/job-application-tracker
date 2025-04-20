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

    if (loaderRef.current && hasNextPage) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
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
    console.log("Delete clicked, id:", id);
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
        return "border-warning text-warning";
      case "applied":
        return "border-primary text-primary";
      case "interview":
        return "border-secondary text-secondary";
      case "offer":
        return "border-success text-success";
      case "rejected":
        return "border-error text-error";
      default:
        return "border-neutral text-neutral";
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

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardItem = {
    hidden: { scale: 0.8, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: { type: "tween", duration: 0.3, ease: "easeOut" },
    },
  };

  const filterItem = (index: number) => ({
    hidden: { x: index < statusOptions.length / 2 ? -100 : 100, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 150, damping: 15 },
    },
  });

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-base-200 to-base-300">
        <div className="text-center space-y-6">
          <div className="flex justify-center gap-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-12 h-12 bg-base-100 rounded-full shadow-lg"
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
              />
            ))}
          </div>
          <p className="text-xl text-base-content/70 animate-pulse font-semibold">
            Fetching your applications...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="alert alert-error max-w-lg mx-auto mt-16 shadow-2xl rounded-xl bg-gradient-to-r from-error/10 to-error/20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-lg font-medium">Error: {error}</span>
        <motion.button
          className="btn btn-sm btn-outline"
          onClick={() => dispatch(getApplications({ page: 1, limit: 10 }))}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <div className="flex items-center space-x-4">
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Job Applications
            </motion.h1>
            <motion.div
              className="badge badge-lg bg-primary text-primary-content shadow-md"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5, type: "spring" }}
            >
              {uniqueApplications.length}
            </motion.div>
          </div>
          <motion.button
            className="btn btn-primary btn-lg gap-3 mt-6 md:mt-0 bg-gradient-to-r from-primary to-primary-focus text-primary-content shadow-lg"
            onClick={handleCreateClick}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          className="tabs tabs-boxed justify-center mb-12 p-3 bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.a
            className={`tab tab-lg font-semibold rounded-xl transition-all ${
              !selectedFilter
                ? "bg-primary text-primary-content shadow-md"
                : "text-base-content/70"
            }`}
            onClick={() => setSelectedFilter(null)}
            whileHover={{ scale: 1.05 }}
          >
            All
          </motion.a>
          {statusOptions.map((status, index) => (
            <motion.a
              key={status}
              className={`tab tab-lg font-semibold rounded-xl gap-2 transition-all ${
                selectedFilter === status
                  ? "bg-primary text-primary-content shadow-md"
                  : "text-base-content/70"
              }`}
              onClick={() => setSelectedFilter(status)}
              variants={filterItem(index)}
              initial="hidden"
              animate="show"
              whileHover={{ scale: 1.05 }}
            >
              {getStatusIcon(status)}
              <span className="capitalize">{status}</span>
            </motion.a>
          ))}
        </motion.div>

        {filteredApplications.length === 0 ? (
          <motion.div
            className="card bg-base-100/90 backdrop-blur-md shadow-2xl text-center p-12 max-w-md mx-auto rounded-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <div className="flex flex-col items-center gap-6">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-base-content/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </motion.svg>
              <p className="text-xl text-base-content/70 font-medium">
                {selectedFilter
                  ? `No ${selectedFilter} applications found.`
                  : "No applications found. Start by creating a new application."}
              </p>
              <motion.button
                className="btn btn-primary bg-gradient-to-r from-primary to-primary-focus text-primary-content"
                onClick={handleCreateClick}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Create Application
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-6 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={container}
            initial="hidden"
            animate="show"
            key={selectedFilter || "all"}
          >
            <AnimatePresence>
              {filteredApplications.map((app: Application) => (
                <motion.div
                  layout
                  key={app._id}
                  variants={cardItem}
                  className={`card bg-base-100/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all rounded-2xl border-l-4 ${getStatusColor(
                    app.status
                  )}`}
                  initial="hidden"
                  animate="show"
                  exit={{
                    opacity: 0,
                    scale: 0.7,
                    transition: { duration: 0.2 },
                  }}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="card-body p-6">
                    <div className="flex justify-between items-start">
                      <h2 className="card-title text-xl font-bold text-base-content line-clamp-1">
                        {app.jobTitle}
                      </h2>
                      <div className="dropdown dropdown-end">
                        <label
                          tabIndex={0}
                          className={`badge gap-2 py-4 px-3 font-medium ${getStatusColor(
                            app.status
                          )} bg-opacity-10 hover:brightness-110 transition-all cursor-pointer rounded-lg`}
                        >
                          {getStatusIcon(app.status)}
                          <span className="capitalize">{app.status}</span>
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-2 shadow-2xl bg-base-100/95 backdrop-blur-sm rounded-xl w-40"
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
                                className={`capitalize gap-2 text-base-content hover:bg-primary hover:text-primary-content rounded-lg ${getStatusColor(
                                  status
                                )}`}
                              >
                                {getStatusIcon(status)}
                                {status}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="font-semibold text-base-content/80 flex items-center gap-2 text-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-base-content/50"
                        fill="none"
                        viewBox="0 0 24 22"
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
                    <div className="divider my-3 opacity-50"></div>
                    <div className="text-base text-base-content/70 space-y-3">
                      <p className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-base-content/50"
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
                      <p className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-base-content/50"
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
                        <p className="line-clamp-2 pt-2 text-base-content/60">
                          {app.description}
                        </p>
                      )}
                    </div>
                    {app.jobUrl && (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary text-base inline-flex items-center gap-2 mt-3 hover:gap-3 transition-all font-medium"
                      >
                        View Job Listing
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
                    <div className="card-actions justify-between pt-5 mt-3 border-t border-base-200/50">
                      <div className="tooltip" data-tip="Edit application">
                        <motion.button
                          className="btn btn-sm btn-circle bg-accent/10 text-accent hover:bg-accent hover:text-accent-content shadow-md"
                          onClick={() => handleEditClick(app._id)}
                          whileHover={{
                            scale: 1.15,
                            rotate: 90,
                            boxShadow: "0 0 10px rgba(236, 72, 153, 0.5)",
                          }}
                          whileTap={{ scale: 0.9 }}
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
                      </div>
                      <div className="flex gap-2">
                        {app.resumeUrl && (
                          <>
                            <div className="tooltip" data-tip="View resume">
                              <motion.button
                                className="btn btn-sm btn-circle bg-info/10 text-info hover:bg-info hover:text-info-content shadow-md"
                                onClick={() => handleView(app.resumeUrl)}
                                whileHover={{
                                  scale: 1.15,
                                  boxShadow: "0 0 10px rgba(34, 211, 238, 0.5)",
                                }}
                                whileTap={{ scale: 0.9 }}
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
                            </div>
                            <div className="tooltip" data-tip="Download resume">
                              <motion.button
                                className="btn btn-sm btn-circle bg-primary/10 text-primary hover:bg-primary hover:text-primary-content shadow-md"
                                onClick={() =>
                                  handleDownload(
                                    app.resumeUrl,
                                    `${app.jobTitle}-resume.pdf`
                                  )
                                }
                                whileHover={{
                                  scale: 1.15,
                                  boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                                }}
                                whileTap={{ scale: 0.9 }}
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
                            </div>
                          </>
                        )}
                        <div className="tooltip" data-tip="Delete application">
                          <motion.button
                            className="btn btn-sm btn-circle bg-error/10 text-error hover:bg-error hover:text-error-content shadow-md"
                            onClick={() => handleDeleteClick(app._id)}
                            whileHover={{
                              scale: 1.15,
                              boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)",
                            }}
                            whileTap={{ scale: 0.9 }}
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
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {hasNextPage && (
          <motion.div
            ref={loaderRef}
            className="flex justify-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-3">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-8 bg-primary/20 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
                <p className="text-base-content/60 font-medium">
                  Loading more applications...
                </p>
              </div>
            ) : (
              <p className="text-base-content/60 font-medium animate-pulse">
                Scroll to load more...
              </p>
            )}
          </motion.div>
        )}

        {!hasNextPage && uniqueApplications.length > 0 && (
          <motion.div
            className="flex justify-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge badge-lg bg-base-100/80 text-base-content/70 shadow-md">
              End of applications
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {deleteId && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 z-[1000] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() =>
                console.log("Modal overlay rendered, deleteId:", deleteId)
              }
            >
              <motion.div
                className="bg-base-100 rounded-2xl p-8 max-w-md w-full shadow-2xl z-[1001]"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-bold text-2xl text-base-content text-center mb-4">
                  Confirm Deletion
                </h3>
                <div className="py-4 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-error mx-auto mb-4"
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
                  <p className="text-lg text-base-content">
                    Are you sure you want to delete this application?
                  </p>
                  <p className="text-sm text-base-content/60 mt-2">
                    This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <motion.button
                    className="btn btn-error bg-red-500 text-white shadow-md"
                    onClick={confirmDelete}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                  <motion.button
                    className="btn btn-outline text-base-content shadow-md"
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
