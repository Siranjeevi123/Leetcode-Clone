import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full py-4 border-t border-border-subtle bg-app-bg">
      <div className="max-w-7xl mx-auto px-10 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            CodeForge
          </span>
          <p className="text-sm text-on-surface-variant">© 2024 CodeForge. All rights reserved.</p>
        </div>
        <div className="flex gap-6">
          <span className="text-sm text-on-surface-variant hover:text-primary cursor-pointer">
            About
          </span>
          <span className="text-sm text-on-surface-variant hover:text-primary cursor-pointer">
            Terms
          </span>
          {!localStorage.getItem("token") && (
            <Link to="/signup" className="text-sm text-on-surface-variant hover:text-primary">
              Privacy
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
