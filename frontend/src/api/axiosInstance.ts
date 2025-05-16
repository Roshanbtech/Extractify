import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
});

// ✅ Fix: Prioritize LocalStorage for token retrieval
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || Cookies.get("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  } else {
    console.warn("⚠️ No authentication token found!");
  }

  return config;
});

// ✅ Fix: Only log out if token exists to prevent unnecessary redirects
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const tokenExists = localStorage.getItem("accessToken");

    if (status === 401 && tokenExists) {
      localStorage.removeItem("accessToken"); // ✅ Properly clear token
      useAuthStore.getState().logout();
      toast.error("Session expired. Please login again.");
      window.location.href = "/login"; 
    } else if (status !== 401) {
      const msg = err.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }

    return Promise.reject(err);
  }
);

export default instance;
