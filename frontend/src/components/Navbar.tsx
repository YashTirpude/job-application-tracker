import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store";
import { setApplications } from "../store/slices/applicationSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, LogOut, Briefcase } from "lucide-react";
import api from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!token || !searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.get("/applications", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchQuery, page: 1, limit: 10 },
      });
      dispatch(setApplications(res.data.applications));
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = async () => {
    setSearchQuery("");
    if (!token) return;
    try {
      const res = await api.get("/applications", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1, limit: 10 },
      });
      dispatch(setApplications(res.data.applications));
    } catch (error) {
      console.error("Failed to reset search", error);
    }
  };

  // Animation variants aligned with ApplicationCard
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.4)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.97 },
  };

  const searchIconAnimation = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gray-800/90 backdrop-blur-lg border-b border-gray-700 ${
          scrolled ? "shadow-2xl py-2" : "py-3"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Briefcase className="text-indigo-400 h-6 w-6 md:h-7 md:w-7" />
              </motion.div>
              <span className="text-xl md:text-2xl font-bold text-white">
                Job<span className="text-indigo-400">Tracker</span>
              </span>
            </Link>
          </motion.div>

          {token && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex-1 mx-4 max-w-md"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="w-full h-9 sm:h-10 px-10 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 text-sm sm:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <motion.div
                  variants={searchIconAnimation}
                  whileHover="hover"
                  className="absolute left-3 text-gray-400"
                >
                  <Search size={16} />
                </motion.div>
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute right-10 text-gray-400 hover:text-gray-200 transition-colors"
                      onClick={clearSearch}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </AnimatePresence>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleSearch}
                  className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-md transition-colors duration-200"
                  aria-label="Search"
                >
                  {isSearching ? (
                    <motion.div
                      className="w-4 h-4 rounded-full border-2 border-white border-t-indigo-400"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    <Search size={16} />
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          <div className="flex items-center gap-2">
            {token ? (
              <>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  <LogOut size={16} className="text-indigo-400" />
                  <span>Logout</span>
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleLogout}
                  className="md:hidden p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors duration-200"
                  aria-label="Logout"
                >
                  <LogOut size={20} className="text-indigo-400" />
                </motion.button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-300 hover:text-indigo-400 transition-colors duration-200 hidden md:block"
                  >
                    Login
                  </Link>
                  <Link
                    to="/login"
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors duration-200 md:hidden"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 hidden md:block"
                  >
                    Register
                  </Link>
                  <Link
                    to="/register"
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 md:hidden"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navbar;
