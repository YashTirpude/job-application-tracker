import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store";
import { setApplications } from "../store/slices/applicationSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Menu, LogOut, Home, User, UserPlus } from "lucide-react";
import api from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
    setIsMenuOpen(false);
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
      setIsMenuOpen(false);
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
    <>
      <motion.nav
        className="navbar bg-base-100 shadow-lg px-4 md:px-6 py-3 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex justify-between items-center w-full">
          {/* Logo Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="navbar-start"
          >
            <Link
              to="/"
              className="text-xl md:text-2xl font-bold text-primary flex items-center"
            >
              <span className="text-2xl md:text-3xl">J</span>ob
              <span className="text-2xl md:text-3xl">T</span>racker
            </Link>
          </motion.div>

          {/* Search Bar - Desktop */}
          {token && (
            <div className="navbar-center hidden lg:flex">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative flex items-center"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="input input-bordered w-64 md:w-72 pr-10 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-12 top-3 text-gray-400 hover:text-error"
                        onClick={clearSearch}
                      >
                        <X size={18} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-3 top-3 text-primary"
                    onClick={handleSearch}
                  >
                    <Search size={18} />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Auth Buttons - Desktop */}
          <div className="navbar-end hidden lg:flex">
            {token ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="btn btn-error btn-outline gap-2"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            ) : (
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/login" className="btn btn-ghost text-primary">
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/register" className="btn btn-primary">
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn-ghost btn-circle"
            >
              <Menu size={22} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-base-100 pt-20 px-6"
          >
            <div className="flex flex-col h-full">
              {/* Close button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-6 right-6"
              >
                <X size={24} />
              </motion.button>

              {/* Mobile Search */}
              {token && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-3 text-primary">
                    Search
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      className="input input-bordered w-full pr-10 rounded-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    {searchQuery && (
                      <button
                        className="absolute right-10 top-3 text-gray-400"
                        onClick={clearSearch}
                      >
                        <X size={18} />
                      </button>
                    )}
                    <button
                      className="absolute right-3 top-3 text-primary"
                      onClick={handleSearch}
                    >
                      <Search size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-4">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home size={20} className="text-primary" />
                    <span className="text-lg">Home</span>
                  </Link>
                </motion.div>

                {/* Auth Actions */}
                {token ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-200 text-error"
                  >
                    <LogOut size={20} />
                    <span className="text-lg">Logout</span>
                  </motion.button>
                ) : (
                  <>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/login"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={20} className="text-primary" />
                        <span className="text-lg">Login</span>
                      </Link>
                    </motion.div>

                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/register"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserPlus size={20} />
                        <span className="text-lg">Register</span>
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
