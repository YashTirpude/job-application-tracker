import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store";
import { setApplications } from "../store/slices/applicationSlice";
import { motion } from "framer-motion";
import api from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!token) return;

    try {
      const res = await api.get("/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: searchQuery,
          page: 1,
          limit: 10,
        },
      });
      dispatch(setApplications(res.data.applications));
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const clearSearch = async () => {
    setSearchQuery("");
    try {
      const res = await api.get("/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: 1,
          limit: 10,
        },
      });
      dispatch(setApplications(res.data.applications));
    } catch (error) {
      console.error("Failed to reset search", error);
    }
  };

  return (
    <motion.nav
      className="navbar bg-base-100 shadow-lg px-6 py-4 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-start">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05, color: "#1d4ed8" }}
        >
          <Link to="/" className="text-2xl font-bold text-primary">
            <span className="text-3xl">J</span>ob
            <span className="text-3xl">T</span>racker
          </Link>
        </motion.div>
      </div>

      {token && (
        <div className="navbar-center hidden md:flex">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search jobs..."
              className="input input-bordered w-40 md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {searchQuery && (
              <button
                className="btn btn-sm btn-ghost text-error"
                onClick={clearSearch}
              >
                ✕
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      )}

      <div className="navbar-end">
        <div className="flex items-center gap-4">
          {token ? (
            <motion.div whileHover={{ scale: 1.05 }}>
              <button
                onClick={handleLogout}
                className="btn btn-error btn-outline"
              >
                Logout
              </button>
            </motion.div>
          ) : (
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/login" className="btn btn-ghost text-primary">
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
