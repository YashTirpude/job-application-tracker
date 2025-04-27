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
import ApplicationCard from "./ApplicationCard";
import StatusFilter from "./StatusFilter";
import ConfirmationModal from "./ConfirmationModal";
import EmptyState from "./EmptyState";
import ListHeader from "./ListHeader";
import { LoadingSpinner, PageLoader } from "./Loaders";

const ApplicationList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const loaderRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { token } = useSelector((state: RootState) => state.auth);
  const { applications, loading, error, hasNextPage } = useSelector(
    (state: RootState) => state.applications
  );

  // Remove duplicates by ID
  const uniqueApplications = Array.from(
    new Map(applications.map((app) => [app._id, app])).values()
  );

  // Filter applications by status if a filter is selected
  const filteredApplications = selectedFilter
    ? uniqueApplications.filter((app) => app.status === selectedFilter)
    : uniqueApplications;

  // Initial fetch of applications
  useEffect(() => {
    if (token) {
      dispatch(getApplications({ page, limit: 10 }));
    }
  }, [dispatch, token, page]);

  // Infinite scroll setup
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

  // Action handlers
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

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ListHeader
          count={uniqueApplications.length}
          onCreateClick={handleCreateClick}
        />
        <EmptyState
          type="error"
          message={error}
          onAction={() => dispatch(getApplications({ page: 1, limit: 10 }))}
          actionText="Retry"
        />
      </div>
    );
  }

  // Initial loading state
  if (loading && page === 1) {
    return <PageLoader />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <ListHeader
        count={uniqueApplications.length}
        onCreateClick={handleCreateClick}
      />

      {/* Filter Section */}
      <StatusFilter
        applications={uniqueApplications}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* Application Cards */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          type="empty"
          selectedFilter={selectedFilter}
          onAction={handleCreateClick}
          actionText="Create Application"
        />
      ) : (
        <motion.div
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {filteredApplications.map((app: Application) => (
              <ApplicationCard
                key={app._id}
                application={app}
                onEdit={() => handleEditClick(app._id)}
                onDelete={() => handleDeleteClick(app._id)}
                token={token}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Infinite Scroll Loader */}
      {hasNextPage && (
        <div ref={loaderRef} className="flex justify-center py-10">
          {loading ? (
            <LoadingSpinner message="Loading more applications..." />
          ) : (
            <motion.p
              className="text-gray-600 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Scroll to load more applications
            </motion.p>
          )}
        </div>
      )}

      {/* End of list message */}
      {!hasNextPage && uniqueApplications.length > 0 && (
        <motion.div
          className="flex justify-center py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.p
            className="px-5 py-2 bg-white/80 backdrop-blur-sm rounded-lg text-gray-600 font-medium shadow-md"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            You've reached the end of your applications
          </motion.p>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteId}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this application? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ApplicationList;
