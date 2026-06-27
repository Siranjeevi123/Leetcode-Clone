import DifficultyBadge from "../DifficultyBadge";
import TestCaseText from "../TestCaseText";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import type { ProblemDetail } from "../../types";
import { TAG_LABELS } from "../../types";

interface ProblemDescriptionPanelProps {
  problem: ProblemDetail;
  isAdmin?: boolean;
  onDelete?: () => void;
}

export default function ProblemDescriptionPanel({
  problem,
  isAdmin,
  onDelete,
}: ProblemDescriptionPanelProps) {
  return (
    <div className="space-y-6 animate-[slide-in_0.3s_ease-out]">
      <div>
        <div className="flex items-start gap-3 mb-3 flex-wrap">
          <h1 className="text-xl md:text-2xl font-semibold text-on-surface leading-tight">
            {problem.title}
          </h1>
          <DifficultyBadge difficulty={problem.difficulty} />
          {isAdmin && onDelete && (
            <Button
              variant="danger"
              size="sm"
              className="ml-auto"
              onClick={onDelete}
              icon={<span className="material-symbols-outlined text-sm">delete</span>}
            >
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {problem.tags.map((t) => (
            <Badge key={t}>{TAG_LABELS[t]}</Badge>
          ))}
        </div>
      </div>

      <div className="text-on-surface leading-relaxed whitespace-pre-wrap text-sm md:text-base">
        {problem.description}
      </div>

      {problem.visibleTestCases.map((tc, i) => (
        <div key={i} className="bg-surface rounded-lg border border-border-subtle p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Example {i + 1}
          </h3>
          <div className="font-mono text-sm bg-surface-container-lowest rounded-lg p-3 border border-border-subtle space-y-2">
            <TestCaseText label="Input:" value={tc.input} />
            <TestCaseText label="Output:" value={tc.output} />
            {tc.explanation && <TestCaseText label="Explanation:" value={tc.explanation} />}
          </div>
        </div>
      ))}

      <div>
        <h3 className="text-base font-semibold text-on-surface mb-3">Constraints</h3>
        <ul className="list-disc ml-5 text-sm text-on-surface-variant space-y-1.5">
          <li>Input sizes are within problem limits</li>
          <li>Follow the problem description carefully</li>
          <li className="text-primary-container italic">Verify edge cases before submitting</li>
        </ul>
      </div>
    </div>
  );
}
