import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAccount } from "../api/auth";
import { getErrorMessage } from "../api/client";
import { getProblems, getSolvedProblems } from "../api/problems";
import DifficultyBadge from "../components/DifficultyBadge";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ConfirmModal from "../components/ConfirmModal";
import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";
import type { Difficulty, ProblemListItem } from "../types";

const BOOKMARKS_KEY = "codeforge-bookmarks";

function loadBookmarks(): string[] {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [solved, setSolved] = useState<ProblemListItem[]>([]);
  const [allProblems, setAllProblems] = useState<ProblemListItem[]>([]);
  const [bookmarks] = useState<string[]>(loadBookmarks);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getSolvedProblems()
      .then(({ problems }) => setSolved(problems))
      .catch(() => {});
    getProblems()
      .then(({ problems }) => setAllProblems(problems))
      .catch(() => {});
  }, []);

  const stats = useMemo(() => {
    const byDiff: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
    solved.forEach((p) => {
      byDiff[p.difficulty]++;
    });
    const acceptanceRate =
      allProblems.length > 0
        ? Math.round((solved.length / allProblems.length) * 100)
        : 0;
    return { byDiff, acceptanceRate };
  }, [solved, allProblems]);

  const bookmarkedProblems = allProblems.filter((p) => bookmarks.includes(p._id));

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      await logout();
      toast.success("Account deleted");
      window.location.href = "/";
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-app-bg text-on-surface min-h-screen animate-[slide-in_0.3s_ease-out]">
      <Navbar />

      <main className="pt-20 pb-8 px-4 md:px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Profile header */}
          <Card className="col-span-12 lg:col-span-8 relative overflow-hidden" padding="lg">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-surface-container-high border-2 border-primary-container/50 shrink-0 flex items-center justify-center text-4xl md:text-5xl font-bold text-primary">
                {user.firstName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow text-center md:text-left flex flex-col md:flex-row justify-between items-center w-full">
                <div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1 justify-center md:justify-start">
                    <h1 className="text-2xl md:text-3xl font-semibold">{user.firstName}</h1>
                    <Badge variant="primary">{user.role}</Badge>
                  </div>
                  <p className="text-on-surface-variant">{user.emailId}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    await logout();
                    window.location.href = "/login";
                  }}
                  className="mt-4 md:mt-0"
                >
                  Logout
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats cards */}
          <Card className="col-span-6 lg:col-span-2" padding="md">
            <div className="text-2xl font-bold text-success">{user.problemSolved.length}</div>
            <div className="text-xs uppercase tracking-wider text-on-surface-variant mt-1">Solved</div>
          </Card>
          <Card className="col-span-6 lg:col-span-2" padding="md">
            <div className="text-2xl font-bold text-primary-container">{stats.acceptanceRate}%</div>
            <div className="text-xs uppercase tracking-wider text-on-surface-variant mt-1">Completion</div>
          </Card>

          {/* Difficulty breakdown */}
          <Card className="col-span-12 lg:col-span-4" padding="md">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
              By Difficulty
            </h3>
            <div className="space-y-3">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <div key={d} className="flex items-center justify-between">
                  <DifficultyBadge difficulty={d} />
                  <span className="font-semibold">{stats.byDiff[d]}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent activity */}
          <Card className="col-span-12 lg:col-span-8" padding="none">
            <div className="p-5 border-b border-border-subtle flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recently Solved</h2>
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
                {solved.slice(0, 5).map((p) => (
                  <Link
                    key={p._id}
                    to={`/problems/${p._id}`}
                    className="p-4 flex items-center justify-between hover:bg-surface-container transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="material-symbols-outlined text-success shrink-0"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      <span className="truncate group-hover:text-primary transition-colors">{p.title}</span>
                    </div>
                    <DifficultyBadge difficulty={p.difficulty} />
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Bookmarks */}
          <Card className="col-span-12 lg:col-span-4" padding="none">
            <div className="p-5 border-b border-border-subtle">
              <h2 className="text-lg font-semibold">Bookmarks</h2>
            </div>
            {bookmarkedProblems.length === 0 ? (
              <p className="p-5 text-sm text-on-surface-variant">
                Bookmark problems from the problem page to see them here.
              </p>
            ) : (
              <div className="divide-y divide-border-subtle">
                {bookmarkedProblems.map((p) => (
                  <Link
                    key={p._id}
                    to={`/problems/${p._id}`}
                    className="p-3 block text-sm hover:bg-surface-container hover:text-primary transition-colors"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Danger zone */}
          <Card className="col-span-12 border-error/30 bg-error/5" padding="lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-error flex items-center gap-2">
                  <span className="material-symbols-outlined">warning</span>
                  Danger Zone
                </h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  Deleting your account is permanent. All progress will be lost.
                </p>
              </div>
              <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />

      <ConfirmModal
        open={deleteOpen}
        title="Delete Account"
        message="Are you sure? This action cannot be undone."
        confirmLabel="Delete Account"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
