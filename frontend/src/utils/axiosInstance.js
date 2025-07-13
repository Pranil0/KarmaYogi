// src/utils/axiosInstance.js
import axios from "axios";

export const BASE_URL = "http://localhost:5000"; // or your deployed backend

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // ✅ Only attach token if valid
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
