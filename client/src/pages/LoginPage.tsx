import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import LoadingScreen from "../components/ui/LoadingScreen";
import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";

export default function LoginPage() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  if (loading) {
    return <LoadingScreen message="Signing in..." />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(emailId, password);
      toast.success("Login successful");
      navigate("/problems");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-app-bg">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <main className="relative z-10 w-full px-4 flex flex-col items-center">
        <div className="w-full max-w-[400px] p-8 rounded-xl shadow-2xl bg-surface border border-border-subtle">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center mb-4">
              <span
                className="material-symbols-outlined text-on-primary-container text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                terminal
              </span>
            </div>
            <h1 className="text-xl font-semibold text-on-surface">CodeForge</h1>
            <p className="text-sm text-on-surface-variant mt-1">Precision engineering for developers</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="dev@codeforge.com"
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg py-3 pl-11 pr-4 text-sm text-on-surface input-focus-ring"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  lock
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  maxLength={20}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg py-3 pl-11 pr-4 text-sm text-on-surface input-focus-ring"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-on-primary-container font-semibold py-3 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin-custom text-[18px]">sync</span>
              ) : (
                <>
                  <span>Login</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border-subtle text-center">
            <p className="text-sm text-on-surface-variant">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-on-surface-variant/60">
            © 2024 CODEFORGE INC.
          </p>
        </footer>
      </main>
    </div>
  );
}
