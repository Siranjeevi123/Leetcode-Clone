import type { Difficulty } from "../types";

const styles: Record<Difficulty, string> = {
  easy: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  hard: "bg-error/10 text-error",
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
