import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useAuthStore } from "../store/authStore";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const loading = useAuthStore((s) => s.loading);
  const location = useLocation(); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/auth/check");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (location.pathname !== "/login" && location.pathname !== "/signup") {
      checkAuth();
    } else {
      setLoading(false); 
    }
  }, [location.pathname, setUser, setLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};
