import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { getApplications } from "../store/slices/applicationSlice";
import { useNavigate } from "react-router-dom";

const ApplicationList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { applications, loading, error } = useSelector(
    (state: RootState) => state.applications
  );
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getApplications());
    }
  }, [dispatch, token]);

  const handleCreateClick = () => {
    navigate("/create");
  };

  // Format date to a more readable format
  const formatDate = (dateString: any) => {
    const options: any = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color based on application status
  const getStatusColor = (status: any) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "applied":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "interview":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "offer":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Function to create thumbnail URL for Cloudinary PDFs
  const getCloudinaryThumbnail = (pdfUrl: any) => {
    // Check if it's a Cloudinary URL
    if (pdfUrl && pdfUrl.includes("cloudinary.com")) {
      // Transform the URL to get a PNG thumbnail of the first page
      // Format: https://res.cloudinary.com/[cloud_name]/image/upload/c_thumb,pg_1,w_400,h_500,f_png/v1234/path/to/file.pdf

      try {
        const urlParts = pdfUrl.split("/upload/");
        if (urlParts.length === 2) {
          return `${urlParts[0]}/upload/c_thumb,pg_1,w_300,h_400,f_png/${urlParts[1]}`;
        }
      } catch (e) {
        console.error("Error creating thumbnail URL:", e);
      }
    }
    return null;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 text-center mt-10 p-4 bg-red-50 rounded-lg border border-red-200">
        Error loading applications: {error}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <button
          onClick={handleCreateClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + New Application
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No applications found. Start by creating a new application.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => {
            // Generate thumbnail if it's a Cloudinary PDF
            const thumbnailUrl = app.resumeUrl
              ? getCloudinaryThumbnail(app.resumeUrl)
              : null;

            return (
              <div
                key={app._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 space-y-3 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {app.jobTitle}
                  </h2>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>

                <p className="text-gray-700 font-medium">{app.company}</p>

                <div className="text-sm text-gray-500 space-y-1">
                  <p>Applied: {formatDate(app.dateApplied)}</p>
                  <p>Platform: {app.jobPlatform}</p>
                  {app.description && (
                    <p className="line-clamp-2">{app.description}</p>
                  )}
                </div>

                <a
                  href={app.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm inline-block"
                >
                  View Job Listing
                </a>

                {app.resumeUrl && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Resume:
                      </h3>
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs underline"
                      >
                        Open PDF
                      </a>
                    </div>

                    {thumbnailUrl ? (
                      // Show Cloudinary-generated thumbnail
                      <div className="resume-thumbnail">
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={thumbnailUrl}
                            alt="Resume preview"
                            className="w-full h-48 object-contain bg-gray-50 rounded border"
                          />
                        </a>
                      </div>
                    ) : (
                      // Fallback PDF preview with icon
                      <div className="resume-placeholder bg-gray-50 rounded border p-4 flex flex-col items-center justify-center h-48">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-500 mt-2">
                          PDF Resume
                        </span>
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-blue-600 underline text-xs"
                        >
                          View PDF
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
