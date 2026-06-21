import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { useAuthStore } from "./store/authStore";

function Bootstrap() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
    const onLogout = () => useAuthStore.getState().setUser(null);
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, [initialize]);

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>
);
