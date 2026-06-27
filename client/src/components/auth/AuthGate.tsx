import type { ReactNode } from "react";
import LoadingScreen from "../ui/LoadingScreen";
import { useAuthStore } from "../../store/authStore";

export default function AuthGate({ children }: { children: ReactNode }) {
  const initialized = useAuthStore((s) => s.initialized);
  const restoring = useAuthStore((s) => s.restoring);

  if (!initialized || restoring) {
    return <LoadingScreen message="Restoring session..." />;
  }

  return <>{children}</>;
}
