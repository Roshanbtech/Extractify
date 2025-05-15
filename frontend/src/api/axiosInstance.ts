import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
});
instance.interceptors.request.use((config) => {
  // const token = useAuthStore.getState().token;
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  const token = Cookies.get("accessToken");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401) {
      useAuthStore.getState().logout();
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    } else {
      const msg = err.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
    return Promise.reject(err);
  }
);
export default instance;
