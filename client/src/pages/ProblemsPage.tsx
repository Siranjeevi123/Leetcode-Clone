import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { deleteProblem, getProblems } from "../api/problems";
import ConfirmModal from "../components/ConfirmModal";
import DifficultyBadge from "../components/DifficultyBadge";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProblemCard from "../components/problems/ProblemCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { ProblemListSkeleton } from "../components/ui/Skeleton";
import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";
import type { Difficulty, ProblemListItem, Tag } from "../types";
import { TAG_LABELS, TAGS } from "../types";

const PAGE_SIZE = 12;

export default function ProblemsPage() {
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [tag, setTag] = useState<Tag | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "solved" | "unsolved">("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
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

  useEffect(() => {
    setPage(1);
  }, [search, difficulty, tag, statusFilter]);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const solvedCount = problems.filter((p) => solvedSet.has(p._id)).length;

  const pickRandom = () => {
    const unsolved = filtered.filter((p) => !solvedSet.has(p._id));
    const pool = unsolved.length ? unsolved : filtered;
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    navigate(`/problems/${pick._id}`);
  };

  const resetFilters = () => {
    setSearch("");
    setDifficulty("all");
    setTag("all");
    setStatusFilter("all");
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
    <div className="flex flex-col min-h-screen bg-app-bg animate-[slide-in_0.3s_ease-out]">
      <Navbar />

      <main className="mt-14 flex-grow px-4 md:px-10 py-8 max-w-7xl mx-auto w-full">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-on-surface">Problems</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              {problems.length} challenges · {solvedCount} solved
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="bg-surface px-4 py-3 border border-border-subtle rounded-xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                Progress
              </span>
              <span className="text-lg font-semibold text-success">
                {solvedCount}/{problems.length}
              </span>
            </div>
            <Button onClick={pickRandom} icon={<span className="material-symbols-outlined text-sm">bolt</span>}>
              Pick One
            </Button>
          </div>
        </header>

        <section className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search problems..."
                className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-10 py-2.5 text-sm text-on-surface input-focus-ring"
              />
            </div>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty | "all")}
              className="bg-surface border border-border-subtle rounded-lg px-4 py-2.5 text-sm input-focus-ring"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="bg-surface border border-border-subtle rounded-lg px-4 py-2.5 text-sm input-focus-ring"
            >
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>
            <div className="flex rounded-lg border border-border-subtle overflow-hidden">
              {(["cards", "table"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-2 text-xs font-semibold uppercase ${
                    viewMode === mode
                      ? "bg-surface-container-high text-primary"
                      : "bg-surface text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTag("all")}
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border transition-colors ${
                tag === "all"
                  ? "bg-primary-container/15 text-primary border-primary-container/30"
                  : "bg-surface text-on-surface-variant border-border-subtle hover:border-on-surface-variant"
              }`}
            >
              All Topics
            </button>
            {TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border transition-colors ${
                  tag === t
                    ? "bg-primary-container/15 text-primary border-primary-container/30"
                    : "bg-surface text-on-surface-variant border-border-subtle hover:border-on-surface-variant"
                }`}
              >
                {TAG_LABELS[t]}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <ProblemListSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="find_in_page"
            title="No problems found"
            description="Adjust your filters or try a different search term."
            actionLabel="Reset Filters"
            onAction={resetFilters}
          />
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginated.map((p) => (
              <div key={p._id} className="relative group">
                <ProblemCard
                  problem={p}
                  solved={solvedSet.has(p._id)}
                  onClick={() => navigate(`/problems/${p._id}`)}
                />
                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(p);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-surface/90 text-error opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-high border-b border-border-subtle">
                    {["", "Title", "Difficulty", "Tags", ...(isAdmin ? ["Actions"] : [])].map((h) => (
                      <th
                        key={h || "status"}
                        className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {paginated.map((p) => (
                    <tr
                      key={p._id}
                      onClick={() => navigate(`/problems/${p._id}`)}
                      className="hover:bg-surface-container-high cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`material-symbols-outlined ${
                            solvedSet.has(p._id) ? "text-success" : "text-on-surface-variant/30"
                          }`}
                          style={solvedSet.has(p._id) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                        >
                          {solvedSet.has(p._id) ? "check_circle" : "radio_button_unchecked"}
                        </span>
                      </td>
                      <td className="px-4 py-3 group-hover:text-primary transition-colors">{p.title}</td>
                      <td className="px-4 py-3">
                        <DifficultyBadge difficulty={p.difficulty} />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex gap-1 flex-wrap">
                          {p.tags.map((t) => (
                            <Badge key={t}>{TAG_LABELS[t]}</Badge>
                          ))}
                        </div>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(p);
                            }}
                            className="text-error hover:bg-error/10 p-1.5 rounded-lg"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-on-surface-variant px-4">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
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
