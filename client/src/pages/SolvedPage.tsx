import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { getSolvedProblems } from "../api/problems";
import DifficultyBadge from "../components/DifficultyBadge";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { toast } from "../store/toastStore";
import type { ProblemListItem } from "../types";
import { TAG_LABELS } from "../types";

export default function SolvedPage() {
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSolvedProblems()
      .then(({ problems: p, count: c }) => {
        setProblems(p);
        setCount(c);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-app-bg">
      <Navbar />

      <main className="mt-14 flex-grow px-10 py-8 max-w-7xl mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-on-surface">Solved Problems ({count})</h1>
          <p className="text-sm text-on-surface-variant mt-1">Problems you have successfully completed.</p>
        </header>

        <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <span className="material-symbols-outlined animate-spin-custom text-primary text-3xl">
                sync
              </span>
            </div>
          ) : problems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-6xl text-border-subtle mb-4">
                task_alt
              </span>
              <h3 className="text-xl font-semibold text-on-surface">
                You haven&apos;t solved any problems yet
              </h3>
              <Link
                to="/problems"
                className="mt-4 bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-semibold hover:brightness-110"
              >
                Browse Problems
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {problems.map((p) => (
                <Link
                  key={p._id}
                  to={`/problems/${p._id}`}
                  className="p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="material-symbols-outlined text-success"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <div>
                      <div className="text-on-surface group-hover:text-primary transition-colors">
                        {p.title}
                      </div>
                      <div className="flex gap-1 mt-1">
                        {p.tags.map((t) => (
                          <span key={t} className="text-xs text-on-surface-variant">
                            {TAG_LABELS[t]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DifficultyBadge difficulty={p.difficulty} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
