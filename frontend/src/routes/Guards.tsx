import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import { JSX } from "react";

export const Public = ({ children }: { children: JSX.Element }) => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return null; // Wait until loading finishes
  }

  return user ? <Navigate to="/" replace /> : children;
};

export const Private = ({ children }: { children: JSX.Element }) => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return null; // Wait until loading finishes
  }

  return user ? children : <Navigate to="/login" replace />;
};
