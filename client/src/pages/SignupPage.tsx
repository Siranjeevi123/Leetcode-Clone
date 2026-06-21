import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import { getErrorMessage } from "../api/client";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { toast } from "../store/toastStore";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup({ firstName, emailId, password });
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-app-bg">
      <Navbar variant="minimal" />

      <main className="flex-grow flex items-center justify-center pt-14 relative overflow-hidden">
        <div className="relative z-10 w-full max-w-[1100px] grid md:grid-cols-2 gap-0 shadow-2xl rounded-xl overflow-hidden border border-border-subtle mx-4">
          <div className="hidden md:flex flex-col justify-between p-8 bg-surface relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-semibold text-on-surface mb-4">
                Engineering Excellence <span className="text-primary">Starts Here</span>.
              </h1>
              <p className="text-on-surface-variant max-w-sm">
                Join the professional platform where elite developers sharpen their skills.
              </p>
            </div>
            <div className="relative z-10 mt-auto flex flex-col gap-2">
              {["PRO-LEVEL WORKSPACE", "REAL-TIME EXECUTION", "CUSTOMIZABLE IDE"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-success">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span className="text-xs font-semibold uppercase tracking-wider">{t}</span>
                </div>
              ))}
            </div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
          </div>

          <div className="bg-surface-container-lowest p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-on-surface mb-1">Create Account</h2>
              <p className="text-sm text-on-surface-variant">Step into the CodeForge ecosystem.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    placeholder="John"
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
                    placeholder="john@codeforge.io"
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
                className="w-full h-11 bg-primary-container text-on-primary-container font-semibold uppercase tracking-wider text-xs rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin-custom">sync</span>
                ) : (
                  <>
                    Create Account
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border-subtle text-center">
              <p className="text-sm text-on-surface-variant">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
