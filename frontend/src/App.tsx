import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ApplicationList from "./components/ApplicationList";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <Router>
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/applications" element={<ApplicationList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
