import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAccount } from "../api/auth";
import { getErrorMessage } from "../api/client";
import { getSolvedProblems } from "../api/problems";
import DifficultyBadge from "../components/DifficultyBadge";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";
import type { ProblemListItem } from "../types";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [solved, setSolved] = useState<ProblemListItem[]>([]);

  useEffect(() => {
    getSolvedProblems()
      .then(({ problems }) => setSolved(problems.slice(0, 4)))
      .catch(() => {});
  }, []);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone."))
      return;
    try {
      await deleteAccount();
      await logout();
      toast.success("Account deleted");
      window.location.href = "/";
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (!user) return null;

  return (
    <div className="bg-app-bg text-on-surface min-h-screen">
      <Navbar />

      <main className="pt-20 pb-8 px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 glass-card p-8 rounded-xl flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="w-32 h-32 rounded-xl bg-surface-container-high border-2 border-primary-container shrink-0 flex items-center justify-center text-5xl font-bold text-primary">
              {user.firstName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1 justify-center md:justify-start">
                <h1 className="text-3xl font-semibold text-on-surface">{user.firstName}</h1>
                <span className="inline-flex items-center px-2 py-1 bg-primary-container text-on-primary-container rounded text-xs font-semibold uppercase self-center">
                  {user.role}
                </span>
              </div>
              <p className="text-on-surface-variant mb-4">{user.emailId}</p>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 glass-card p-8 rounded-xl flex flex-col justify-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">task_alt</span>
              </div>
              <div>
                <div className="text-xl font-semibold text-on-surface">
                  {user.problemSolved.length}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Problems Solved
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 glass-card rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border-subtle flex justify-between items-center">
              <h2 className="text-xl font-semibold text-on-surface">Recently Solved</h2>
              <Link to="/solved" className="text-xs font-semibold uppercase text-primary hover:underline">
                View All
              </Link>
            </div>
            {solved.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant text-sm">
                No solved problems yet.{" "}
                <Link to="/problems" className="text-primary hover:underline">
                  Start solving
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {solved.map((p) => (
                  <Link
                    key={p._id}
                    to={`/problems/${p._id}`}
                    className="p-4 flex items-center justify-between hover:bg-surface-container transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-success">check_circle</span>
                      <div className="text-on-surface group-hover:text-primary transition-colors">
                        {p.title}
                      </div>
                    </div>
                    <DifficultyBadge difficulty={p.difficulty} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-12 mt-8">
            <div className="p-8 rounded-xl border border-error/30 bg-error/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold text-error flex items-center gap-2">
                  <span className="material-symbols-outlined">warning</span>
                  Danger Zone
                </h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  Deleting your account is permanent. All your submissions and progress will be lost.
                </p>
              </div>
              <button
                onClick={handleDelete}
                className="px-6 h-11 bg-error text-white font-bold rounded-lg hover:brightness-110 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
