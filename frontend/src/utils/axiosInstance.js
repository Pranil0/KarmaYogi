// src/utils/axiosInstance.js
import axios from "axios";

// Export base URL so you can import it in other files like Navbar
export const BASE_URL = "http://localhost:5000"; // or your production URL

const instance = axios.create({
  baseURL: BASE_URL,
});

// Optional: automatically attach token for each request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
