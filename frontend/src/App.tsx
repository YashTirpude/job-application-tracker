import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ApplicationList from "./components/ApplicationList";
import HomePage from "./pages/HomePage";
import ResetPassword from "./pages/ResetPassword";
import AuthRedirect from "./pages/AuthRedirect";
import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./pages/Login";

const App = () => {
  return (
    <Router>
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <ApplicationList />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth-redirect" element={<AuthRedirect />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
