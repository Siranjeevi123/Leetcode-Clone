import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Footer() {
  const user = useAuthStore((s) => s.user);

  return (
    <footer className="w-full py-6 border-t border-border-subtle bg-app-bg mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-primary">CodeForge</span>
          <p className="text-xs text-on-surface-variant">© 2024 CodeForge. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {["About", "Terms", "Privacy", "Support"].map((item) => (
            <span
              key={item}
              className="text-xs text-on-surface-variant hover:text-primary cursor-pointer transition-colors"
            >
              {item}
            </span>
          ))}
          {!user && (
            <Link to="/signup" className="text-xs text-primary hover:underline">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
