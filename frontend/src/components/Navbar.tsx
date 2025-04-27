import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store";
import { setApplications } from "../store/slices/applicationSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Menu, LogOut, Briefcase } from "lucide-react";
import api from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearchOnMobile, setShowSearchOnMobile] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowSearchOnMobile(false);
  }, [location.pathname]);

  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showSearchOnMobile && !target.closest(".mobile-search-container")) {
        setShowSearchOnMobile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearchOnMobile]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
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
      setShowSearchOnMobile(false);
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
    initial: { y: -100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const logoVariants = {
    initial: { x: -20, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const mobileMenuVariants = {
    closed: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerDirection: -1,
        staggerChildren: 0.05,
        when: "afterChildren",
      },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const searchIconAnimation = {
    hover: {
      scale: 1.1,
      rotate: [-5, 5, -5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const buttonHoverAnimation = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  const mobileSearchVariants = {
    hidden: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.2 },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        initial="initial"
        animate="animate"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-base-100/90 backdrop-blur-lg shadow-md py-2"
            : "bg-base-100/80 backdrop-blur-sm py-3"
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
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: [0, -10, 20, -10, 0] }}
                transition={{ duration: 0.6 }}
              >
                <Briefcase className="text-primary h-6 w-6 md:h-7 md:w-7" />
              </motion.div>
              <span className="text-xl md:text-2xl font-bold tracking-tight">
                <span className="text-primary">Job</span>
                <span>Tracker</span>
              </span>
            </Link>
          </motion.div>

          {/* Centered Search Bar - Desktop */}
          {token && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: 1,
                width: "auto",
                transition: { delay: 0.3, duration: 0.4 },
              }}
              className="hidden md:block mx-auto max-w-md"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="input input-sm md:input-md input-bordered rounded-full bg-base-200/60 pl-10 pr-10 w-64 lg:w-80 focus:w-96 transition-all duration-300 focus:bg-base-200 h-9 md:h-10 text-base-content"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <motion.div
                  variants={searchIconAnimation}
                  whileHover="hover"
                  className="absolute left-3 text-base-content/60"
                >
                  <Search size={16} />
                </motion.div>
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute right-3 text-base-content/60 hover:text-error transition-colors"
                      onClick={clearSearch}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Auth Actions */}
          <div className="hidden md:flex">
            {token ? (
              <motion.button
                variants={buttonHoverAnimation}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handleLogout}
                className="btn btn-sm md:btn-md btn-primary rounded-full px-4 md:px-5 flex items-center gap-2 h-9 md:h-10 min-h-0"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </motion.button>
            ) : (
              <div className="flex items-center gap-3">
                <motion.div
                  variants={buttonHoverAnimation}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/login"
                    className="btn btn-ghost btn-sm md:btn-md text-primary h-9 md:h-10 min-h-0"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  variants={buttonHoverAnimation}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm md:btn-md rounded-full shadow-md hover:shadow-lg h-9 md:h-10 min-h-0"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Search & Menu */}
          <div className="flex items-center gap-2 md:hidden">
            {token && (
              <motion.button
                variants={buttonHoverAnimation}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowSearchOnMobile(!showSearchOnMobile)}
                className="p-2 rounded-full focus:outline-none hover:bg-base-200 transition-colors"
                aria-label="Search"
              >
                <Search size={20} className="text-primary" />
              </motion.button>
            )}

            <motion.button
              variants={buttonHoverAnimation}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full focus:outline-none hover:bg-base-200 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -45, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar (shown when search icon is clicked) */}
        <AnimatePresence>
          {showSearchOnMobile && token && (
            <motion.div
              variants={mobileSearchVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="md:hidden px-4 py-2 border-t border-base-200 mobile-search-container"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="input input-bordered rounded-full bg-base-200/80 pl-10 pr-10 w-full h-9 text-base-content"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  autoFocus
                />
                <div className="absolute left-3 text-base-content/60">
                  <Search size={16} />
                </div>
                <div className="absolute right-3 flex items-center space-x-1">
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-base-content/60 hover:text-error transition-colors p-1"
                      onClick={clearSearch}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-primary p-1"
                    onClick={handleSearch}
                    aria-label="Search"
                  >
                    <Search size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Slide-in */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed right-0 top-0 h-screen w-4/5 max-w-xs bg-base-100 shadow-xl z-50 md:hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Menu Header */}
              <motion.div
                variants={menuItemVariants}
                className="p-6 border-b border-base-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="text-primary h-6 w-6" />
                  <span className="text-xl font-bold">
                    <span className="text-primary">Job</span>
                    <span>Tracker</span>
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-full hover:bg-base-200"
                >
                  <X size={20} />
                </motion.button>
              </motion.div>

              {/* Mobile Menu Footer */}
              <div className="mt-auto p-6 border-t border-base-200">
                {token ? (
                  <motion.div variants={menuItemVariants} className="w-full">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-content transition-all font-medium"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    <motion.div variants={menuItemVariants}>
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-base-300 hover:bg-base-200 transition-all"
                      >
                        <span className="font-medium">Login</span>
                      </Link>
                    </motion.div>

                    <motion.div variants={menuItemVariants}>
                      <Link
                        to="/register"
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-content hover:brightness-105 transition-all"
                      >
                        <span className="font-medium">Register</span>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;
