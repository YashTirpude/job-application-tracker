import React, { useEffect } from "react";
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
          <li key={app._id}>
            {app.jobTitle} - {app.company}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationList;
