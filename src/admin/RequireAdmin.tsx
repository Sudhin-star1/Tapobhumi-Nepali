import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "./auth";

export function RequireAdmin() {
  const { token } = useAdminAuth();
  const loc = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  }

  return <Outlet />;
}

