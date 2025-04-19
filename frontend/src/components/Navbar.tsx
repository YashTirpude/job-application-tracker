import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [isHovering, setIsHovering] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  const navbarVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const logoVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
    hover: { scale: 1.05, color: "#1d4ed8", transition: { duration: 0.2 } },
  };

  return (
    <motion.nav
      className="navbar bg-base-100 shadow-lg px-6 py-4 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90"
      variants={navbarVariants}
      initial="initial"
      animate="animate"
    >
      <div className="navbar-start">
        <motion.div
          variants={logoVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <Link to="/" className="text-2xl font-bold text-primary">
            <span className="text-3xl">J</span>ob
            <span className="text-3xl">T</span>racker
          </Link>
        </motion.div>
      </div>

      <div className="navbar-end">
        <div className="flex items-center gap-4">
          {token ? (
            <motion.div variants={buttonVariants} whileHover="hover">
              <button
                onClick={handleLogout}
                className="btn btn-error btn-outline"
              >
                Logout
              </button>
            </motion.div>
          ) : (
            <div className="flex items-center gap-4">
              <motion.div variants={buttonVariants} whileHover="hover">
                <Link to="/login" className="btn btn-ghost text-primary">
                  Login
                </Link>
              </motion.div>
              <motion.div variants={buttonVariants} whileHover="hover">
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
