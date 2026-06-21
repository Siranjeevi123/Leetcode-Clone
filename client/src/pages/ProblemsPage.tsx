import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { deleteProblem, getProblems } from "../api/problems";
import ConfirmModal from "../components/ConfirmModal";
import DifficultyBadge from "../components/DifficultyBadge";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";
import type { Difficulty, ProblemListItem, Tag } from "../types";
import { TAG_LABELS, TAGS } from "../types";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [tag, setTag] = useState<Tag | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "solved" | "unsolved">("all");
  const [deleteTarget, setDeleteTarget] = useState<ProblemListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    getProblems()
      .then(({ problems: p }) => setProblems(p))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const solvedSet = useMemo(
    () => new Set(user?.problemSolved ?? []),
    [user?.problemSolved]
  );

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchDiff = difficulty === "all" || p.difficulty === difficulty;
      const matchTag = tag === "all" || p.tags.includes(tag);
      const isSolved = solvedSet.has(p._id);
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "solved" && isSolved) ||
        (statusFilter === "unsolved" && !isSolved);
      return matchSearch && matchDiff && matchTag && matchStatus;
    });
  }, [problems, search, difficulty, tag, statusFilter, solvedSet]);

  const solvedCount = problems.filter((p) => solvedSet.has(p._id)).length;

  const pickRandom = () => {
    const unsolved = filtered.filter((p) => !solvedSet.has(p._id));
    const pool = unsolved.length ? unsolved : filtered;
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    navigate(`/problems/${pick._id}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await deleteProblem(deleteTarget._id);
      setProblems((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success("Problem deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-app-bg">
      <Navbar />

      <main className="mt-14 flex-grow px-10 py-8 max-w-7xl mx-auto w-full">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-on-surface">Problems</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Browsing {problems.length} challenges across various categories.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-surface p-4 border border-border-subtle rounded-lg flex flex-col min-w-[120px]">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                SOLVED
              </span>
              <span className="text-xl font-semibold text-success">
                {solvedCount} / {problems.length}
              </span>
            </div>
          </div>
        </header>

        <section className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
              <div className="relative w-full md:w-80">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search problems..."
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded px-10 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty | "all")}
                className="bg-surface border border-border-subtle rounded px-4 py-2 text-sm text-on-surface-variant"
              >
                <option value="all">Difficulty: All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="bg-surface border border-border-subtle rounded px-4 py-2 text-sm text-on-surface-variant"
              >
                <option value="all">Status: All</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>
            </div>
            <button
              onClick={pickRandom}
              className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              PICK ONE
            </button>
          </div>

          <div className="flex flex-wrap gap-1 pb-2">
            <button
              onClick={() => setTag("all")}
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
                tag === "all"
                  ? "bg-surface-container-high text-primary border-primary-container/30"
                  : "bg-surface text-on-surface-variant border-border-subtle hover:border-on-surface-variant"
              }`}
            >
              All Topics
            </button>
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
                  tag === t
                    ? "bg-surface-container-high text-primary border-primary-container/30"
                    : "bg-surface text-on-surface-variant border-border-subtle hover:border-on-surface-variant"
                }`}
              >
                {TAG_LABELS[t]}
              </button>
            ))}
          </div>
        </section>

        <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 flex justify-center">
              <span className="material-symbols-outlined animate-spin-custom text-primary text-3xl">
                sync
              </span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-6xl text-border-subtle mb-4">
                find_in_page
              </span>
              <h3 className="text-xl font-semibold text-on-surface">No problems found</h3>
              <p className="text-sm text-on-surface-variant max-w-xs mt-2">
                Adjust your filters or try searching for a different keyword.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setDifficulty("all");
                  setTag("all");
                  setStatusFilter("all");
                }}
                className="mt-4 text-xs font-semibold uppercase text-primary border border-primary px-6 py-2 rounded hover:bg-primary/10"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b border-border-subtle">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant w-12 text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Title
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant w-32 text-center">
                      Difficulty
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant hidden md:table-cell">
                      Tags
                    </th>
                    {isAdmin && (
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant w-24 text-center">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filtered.map((p) => {
                    const isSolved = solvedSet.has(p._id);
                    return (
                      <tr
                        key={p._id}
                        onClick={() => navigate(`/problems/${p._id}`)}
                        className="hover:bg-surface-container-high group transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 text-center">
                          {isSolved ? (
                            <span
                              className="material-symbols-outlined text-success text-lg"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              check_circle
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-on-surface-variant/30 text-lg">
                              radio_button_unchecked
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-on-surface group-hover:text-primary transition-colors">
                            {p.title}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <DifficultyBadge difficulty={p.difficulty} />
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex gap-1 flex-wrap">
                            {p.tags.map((t) => (
                              <span
                                key={t}
                                className="text-xs bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant"
                              >
                                {TAG_LABELS[t]}
                              </span>
                            ))}
                          </div>
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(p);
                              }}
                              className="inline-flex items-center justify-center p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors"
                              aria-label={`Delete ${p.title}`}
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Problem"
        message="Are you sure you want to delete this problem?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
