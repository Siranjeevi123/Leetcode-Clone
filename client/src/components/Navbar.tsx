import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar({ variant = "default" }: { variant?: "default" | "minimal" }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-base transition-colors ${
      isActive
        ? "text-primary border-b-2 border-primary pb-1"
        : "text-on-surface-variant hover:text-primary"
    }`;

  return (
    <nav className="fixed top-0 w-full h-14 bg-app-bg z-50 border-b border-border-subtle flex justify-between items-center px-6">
      <div className="flex items-center gap-6">
        <Link to={user ? "/problems" : "/"} className="text-xl font-bold text-primary">
          CodeForge
        </Link>
        {user && variant === "default" && (
          <div className="hidden md:flex gap-6">
            <NavLink to="/problems" className={navLinkClass}>
              Problems
            </NavLink>
            <NavLink to="/solved" className={navLinkClass}>
              Solved
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user?.role === "admin" && (
          <>
            <NavLink
              to="/admin/create"
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`
              }
            >
              Admin
            </NavLink>
            <NavLink
              to="/admin/signup"
              className={({ isActive }) =>
                `hidden md:block text-sm transition-colors ${
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`
              }
            >
              New Admin
            </NavLink>
          </>
        )}
        {user ? (
          <>
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full bg-surface-container-high border border-border-subtle flex items-center justify-center text-sm font-semibold text-primary"
            >
              {user.firstName.charAt(0).toUpperCase()}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-on-surface-variant hover:text-primary">
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-primary-container text-on-primary-container px-4 py-1.5 rounded-lg font-semibold hover:brightness-110"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
