import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return user ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;
