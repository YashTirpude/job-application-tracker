import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ApplicationList from "./components/ApplicationList";
import HomePage from "./pages/HomePage";
import ResetPassword from "./pages/ResetPassword";
import AuthRedirect from "./pages/AuthRedirect";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useAuth from "./hooks/useAuth";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import CreateApplication from "./pages/CreateApplication";

const App = () => {
  useAuth();

  return (
    <Router>
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Layout>
                  <Login />
                </Layout>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Layout>
                  <Register />
                </Layout>
              </PublicRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <PrivateRoute>
                <Layout>
                  <ApplicationList />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <Layout>
                  <CreateApplication />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth-redirect" element={<AuthRedirect />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
