import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "../ui/LoadingScreen";
import { useAuthStore } from "../../store/authStore";

export default function GuestRoute() {
  const initialized = useAuthStore((s) => s.initialized);
  const user = useAuthStore((s) => s.user);

  if (!initialized) {
    return <LoadingScreen message="Restoring session..." />;
  }

  if (user) return <Navigate to="/problems" replace />;
  return <Outlet />;
}
