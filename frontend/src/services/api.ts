import axios from "axios";

const API_URL = "http://localhost:5000"; // Backend API URL

export const fetchApplications = async () => {
  try {
    const token = localStorage.getItem("token"); // ✅ Get token here

    const response = await axios.get(`${API_URL}/api/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};
