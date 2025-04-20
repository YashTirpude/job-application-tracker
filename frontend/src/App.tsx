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
import EditApplicationForm from "./components/routes/EditApplication";
import ForgotPassword from "./pages/ForgotPassword";

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

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <Layout>
                  <ForgotPassword />
                </Layout>
              </PublicRoute>
            }
          />
          <Route
            path="/applications/edit/:id"
            element={<EditApplicationForm />}
          />

          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route path="/auth-redirect" element={<AuthRedirect />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
