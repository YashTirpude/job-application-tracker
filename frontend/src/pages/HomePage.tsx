import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 pt-20">
        <div className="text-center max-w-xl p-6">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Job Tracker App
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Track, manage, and visualize all your job applications in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded-xl shadow hover:bg-blue-50 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
