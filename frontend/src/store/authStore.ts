import { create } from "zustand";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import type { User } from "../types/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  login: async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", res.data.token);
      set({ user: res.data.user });
      toast.success("Logged in successfully.");
    } catch {}
  },
  register: async (name, email, password) => {
    try {
      await axios.post("/auth/register", { name, email, password });
      toast.success("Registered! Please login.");
      window.location.href = "/login";
    } catch {}
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    axios.post("/auth/logout");
    set({ user: null });
    toast.success("Logged out successfully.");
  },
}));
