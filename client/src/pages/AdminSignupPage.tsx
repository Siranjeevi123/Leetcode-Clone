import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { adminSignup } from "../api/auth";
import { getErrorMessage } from "../api/client";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { toast } from "../store/toastStore";

export default function AdminSignupPage() {
  const [firstName, setFirstName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminSignup({ firstName, emailId, password, role: "admin" });
      toast.success(`Admin account created for ${emailId}`);
      setFirstName("");
      setEmailId("");
      setPassword("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-app-bg">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-14 pb-8 px-4">
        <div className="w-full max-w-[480px] p-8 rounded-xl shadow-2xl bg-surface border border-border-subtle">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary-container text-[28px]">
                admin_panel_settings
              </span>
              <h1 className="text-2xl font-semibold text-on-surface">Create Admin Account</h1>
            </div>
            <p className="text-sm text-on-surface-variant">
              Register a new administrator. Only existing admins can access this page.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                First Name
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary text-[20px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={20}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Admin name"
                  className="w-full h-11 pl-12 pr-4 bg-app-bg border border-border-subtle rounded-lg text-on-surface focus-ring"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Email
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary text-[20px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="admin@codeforge.io"
                  className="w-full h-11 pl-12 pr-4 bg-app-bg border border-border-subtle rounded-lg text-on-surface focus-ring"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex justify-between">
                Password
                <span className="text-on-surface-variant/60 font-normal normal-case">6-20 characters</span>
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary text-[20px]">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  maxLength={20}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-12 pr-12 bg-app-bg border border-border-subtle rounded-lg text-on-surface focus-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-[20px]"
                >
                  {showPassword ? "visibility_off" : "visibility"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary-container text-on-primary-container font-semibold rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin-custom">sync</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  Create Admin
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border-subtle flex flex-col gap-2 text-sm text-on-surface-variant">
            <Link to="/admin/create" className="text-primary hover:underline">
              ← Back to Create Problem
            </Link>
            <Link to="/problems" className="hover:text-on-surface transition-colors">
              Go to Problems
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
