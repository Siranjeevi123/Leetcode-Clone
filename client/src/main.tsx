import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { useAuthStore } from "./store/authStore";

void useAuthStore.getState().initialize();

createRoot(document.getElementById("root")!).render(<App />);
