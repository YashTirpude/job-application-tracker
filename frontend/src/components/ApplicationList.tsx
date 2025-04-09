import React, { useEffect, useState } from "react";
import { fetchApplications } from "../services/api";
import { useNavigate } from "react-router-dom";

const ApplicationList = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getApplications = async () => {
      try {
        const data = await fetchApplications();
        setApplications(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError("There was an error fetching applications.");
        setLoading(false);
      }
    };
    getApplications();
  }, []);

  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate("/create");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Job Applications</h1>

      <button
        onClick={handleCreateClick}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + New Application
      </button>
      <ul>
        {applications.map((app) => (
          <li key={app.id}>
            {app.jobTitle} - {app.company}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationList;
