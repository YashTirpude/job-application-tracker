import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { AppDispatch, RootState } from "../store";
import {
  deleteApplication,
  getApplications,
  setApplications,
  Application,
} from "../store/slices/applicationSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ApplicationList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  const { token } = useSelector((state: RootState) => state.auth);
  const { applications, loading, error, hasNextPage } = useSelector(
    (state: RootState) => state.applications
  );

  const uniqueApplications = Array.from(
    new Map(applications.map((app) => [app._id, app])).values()
  );

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
    navigate(`/edit/${id}`);
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
        return "badge-warning";
      case "applied":
        return "badge-primary";
      case "interview":
        return "badge-secondary";
      case "offer":
        return "badge-success";
      case "rejected":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-2xl mx-auto mt-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
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
        <span>Error loading applications: {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          className="text-3xl font-bold text-base-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Job Applications
        </motion.h1>
        <motion.button
          className="btn btn-primary"
          onClick={handleCreateClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + New Application
        </motion.button>
      </div>

      {uniqueApplications.length === 0 ? (
        <motion.div
          className="card bg-base-100 shadow-xl text-center p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-base-content/70">
            No applications found. Start by creating a new application.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {uniqueApplications.map((app: Application) => (
              <motion.div
                key={app._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h2 className="card-title text-lg">{app.jobTitle}</h2>
                    <span className={`badge ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="font-medium text-base-content/80">
                    {app.company}
                  </p>
                  <div className="text-sm text-base-content/60 space-y-1">
                    <p>Applied: {formatDate(app.dateApplied)}</p>
                    <p>Platform: {app.jobPlatform}</p>
                    {app.description && (
                      <p className="line-clamp-2">{app.description}</p>
                    )}
                  </div>
                  {app.jobUrl && (
                    <a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary text-sm"
                    >
                      View Job Listing
                    </a>
                  )}
                  <div className="card-actions justify-end pt-4 border-t border-base-200">
                    {app.resumeUrl && (
                      <>
                        <motion.button
                          className="btn btn-sm btn-outline btn-info"
                          onClick={() => handleView(app.resumeUrl)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View
                        </motion.button>
                        <motion.button
                          className="btn btn-sm btn-outline btn-primary"
                          onClick={() =>
                            handleDownload(
                              app.resumeUrl,
                              `${app.jobTitle}-resume.pdf`
                            )
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Download
                        </motion.button>
                      </>
                    )}
                    <motion.button
                      className="btn btn-sm btn-outline btn-accent"
                      onClick={() => handleEditClick(app._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => handleDeleteClick(app._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {hasNextPage && (
        <div ref={loaderRef} className="flex justify-center py-6">
          {loading ? (
            <span className="loading loading-spinner loading-md text-primary"></span>
          ) : (
            <span className="text-base-content/50">Scroll to load more...</span>
          )}
        </div>
      )}
      {!hasNextPage && uniqueApplications.length > 0 && (
        <div className="flex justify-center py-6">
          <span className="text-base-content/50">
            No more applications to load
          </span>
        </div>
      )}

      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="modal modal-open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4">
                Are you sure you want to delete this application?
              </p>
              <div className="modal-action">
                <motion.button
                  className="btn btn-error"
                  onClick={confirmDelete}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
                <motion.button
                  className="btn btn-outline"
                  onClick={cancelDelete}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicationList;
