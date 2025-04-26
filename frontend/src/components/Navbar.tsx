import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store";
import { setApplications } from "../store/slices/applicationSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Menu,
  LogOut,
  Home,
  User,
  UserPlus,
  Briefcase,
} from "lucide-react";
import api from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleSearch = async () => {
    if (!token || !searchQuery.trim()) return;

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
    if (!token) return;

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

  // Animation variants
  const navbarVariants = {
    initial: { boxShadow: "0 0 0 rgba(0,0,0,0)", y: -100 },
    animate: {
      boxShadow: scrolled
        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        : "0 0 0 rgba(0,0,0,0)",
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const logoVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const menuVariants = {
    closed: { opacity: 0, scale: 0.95, y: -20 },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const searchVariants = {
    initial: { width: "16rem", opacity: 0.9 },
    focus: { width: "20rem", opacity: 1 },
  };

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        initial="initial"
        animate="animate"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-base-100/95 backdrop-blur-md py-2"
            : "bg-base-100/85 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo Section */}
          <motion.div
            variants={logoVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center space-x-1">
              <Briefcase className="text-primary h-6 w-6 md:h-7 md:w-7" />
              <span className="text-xl md:text-2xl font-bold">
                <span className="text-primary">Job</span>
                <span>Tracker</span>
              </span>
            </Link>
          </motion.div>

          {/* Search Bar - Desktop */}
          {token && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden md:block mx-4 flex-grow max-w-md"
            >
              <motion.div
                className="relative w-full"
                initial="initial"
                whileFocus="focus"
                whileHover="focus"
              >
                <motion.input
                  variants={searchVariants}
                  type="text"
                  placeholder="Search job applications..."
                  className="input input-bordered w-full pr-16 h-10 rounded-full bg-base-200/60 focus:bg-base-200 transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <div className="absolute right-0 top-0 h-full flex items-center pr-2 space-x-1">
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-error transition-colors p-1"
                        onClick={clearSearch}
                        aria-label="Clear search"
                      >
                        <X size={16} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-primary p-1"
                    onClick={handleSearch}
                    aria-label="Search"
                  >
                    <Search size={18} />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {token ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-sm md:btn-md rounded-full px-5 flex items-center gap-2 transition-all duration-300"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </motion.button>
            ) : (
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="btn btn-ghost btn-sm md:btn-md text-primary"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm md:btn-md rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden rounded-full p-2 focus:outline-none bg-base-200 hover:bg-base-300 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-base-100/50 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute right-0 top-0 h-screen w-full max-w-md bg-base-100 shadow-xl p-6 pt-20 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Search */}
              {token && (
                <motion.div variants={menuItemVariants} className="mb-8">
                  <h3 className="text-lg font-medium mb-3 text-primary flex items-center gap-2">
                    <Search size={18} />
                    <span>Search</span>
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search job applications..."
                      className="input input-bordered w-full pr-16 rounded-full bg-base-200/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <div className="absolute right-0 top-0 h-full flex items-center pr-2 space-x-1">
                      {searchQuery && (
                        <button
                          className="text-gray-400 hover:text-error transition-colors p-1"
                          onClick={clearSearch}
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button
                        className="text-primary p-1"
                        onClick={handleSearch}
                      >
                        <Search size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Mobile Navigation Links */}
              <nav className="space-y-3">
                <motion.div variants={menuItemVariants}>
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-base-200 transition-all"
                  >
                    <Home size={20} className="text-primary" />
                    <span className="font-medium">Home</span>
                  </Link>
                </motion.div>

                {/* Auth Actions */}
                {token ? (
                  <motion.div variants={menuItemVariants}>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 mt-4 rounded-xl bg-error/10 hover:bg-error/20 text-error transition-all font-medium"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div variants={menuItemVariants}>
                      <Link
                        to="/login"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-base-200 transition-all"
                      >
                        <User size={20} className="text-primary" />
                        <span className="font-medium">Login</span>
                      </Link>
                    </motion.div>

                    <motion.div variants={menuItemVariants}>
                      <Link
                        to="/register"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-content hover:brightness-105 transition-all"
                      >
                        <UserPlus size={20} />
                        <span className="font-medium">Register</span>
                      </Link>
                    </motion.div>
                  </>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;
