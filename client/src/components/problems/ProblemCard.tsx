import { Link } from "react-router-dom";
import DifficultyBadge from "../DifficultyBadge";
import Badge from "../ui/Badge";
import type { ProblemListItem } from "../../types";
import { TAG_LABELS } from "../../types";

interface ProblemCardProps {
  problem: ProblemListItem;
  solved?: boolean;
  onClick: () => void;
}

export default function ProblemCard({ problem, solved, onClick }: ProblemCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-4 md:p-5 rounded-xl border border-border-subtle bg-surface hover:bg-surface-elevated hover:border-primary-container/30 hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-start gap-3">
        <span
          className={`material-symbols-outlined text-xl mt-0.5 shrink-0 ${
            solved ? "text-success" : "text-on-surface-variant/30"
          }`}
          style={solved ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          {solved ? "check_circle" : "radio_button_unchecked"}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
              {problem.title}
            </span>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
          <div className="flex gap-1 flex-wrap">
            {problem.tags.map((t) => (
              <Badge key={t} className="text-[10px]">
                {TAG_LABELS[t]}
              </Badge>
            ))}
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
          arrow_forward
        </span>
      </div>
    </button>
  );
}

export function ProblemCardLink({
  problem,
  solved,
}: {
  problem: ProblemListItem;
  solved?: boolean;
}) {
  return (
    <Link to={`/problems/${problem._id}`} className="block">
      <ProblemCard problem={problem} solved={solved} onClick={() => {}} />
    </Link>
  );
}
