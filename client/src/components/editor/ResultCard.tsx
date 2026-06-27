import type { SubmissionStatus } from "../../types";
import Button from "../ui/Button";

interface ResultCardProps {
  status: SubmissionStatus | "passed" | "failed";
  title: string;
  subtitle?: string;
  runtime?: string;
  memory?: string;
  passed?: number;
  total?: number;
  errorMessage?: string;
  onAskAi?: () => void;
}

const statusConfig: Record<
  string,
  { icon: string; color: string; bg: string; border: string }
> = {
  accepted: {
    icon: "check_circle",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
  },
  passed: {
    icon: "check_circle",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
  },
  wrong_answer: {
    icon: "cancel",
    color: "text-error",
    bg: "bg-error/10",
    border: "border-error/30",
  },
  failed: {
    icon: "cancel",
    color: "text-error",
    bg: "bg-error/10",
    border: "border-error/30",
  },
  compilation_error: {
    icon: "code_off",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
  },
  runtime_error: {
    icon: "bug_report",
    color: "text-error",
    bg: "bg-error/10",
    border: "border-error/30",
  },
  time_limit_exceeded: {
    icon: "timer_off",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
  },
  pending: {
    icon: "hourglass_empty",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
  },
};

export default function ResultCard({
  status,
  title,
  subtitle,
  runtime,
  memory,
  passed,
  total,
  errorMessage,
  onAskAi,
}: ResultCardProps) {
  const config = statusConfig[status] ?? statusConfig.failed;

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden`}>
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className={`material-symbols-outlined ${config.color} text-2xl shrink-0`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {config.icon}
          </span>
          <div className="min-w-0">
            <h4 className={`font-bold text-base ${config.color}`}>{title}</h4>
            {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-on-surface-variant">
              {passed !== undefined && total !== undefined && (
                <span>
                  {passed}/{total} test cases passed
                </span>
              )}
              {runtime && <span>Runtime: {runtime}</span>}
              {memory && <span>Memory: {memory}</span>}
            </div>
          </div>
        </div>
        {onAskAi && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onAskAi}
            icon={
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            }
          >
            Ask AI
          </Button>
        )}
      </div>
      {errorMessage?.trim() && (
        <pre className="px-4 pb-4 text-xs font-mono text-error/90 whitespace-pre-wrap break-words border-t border-error/10 pt-3 mx-4 mb-4">
          {errorMessage.trim()}
        </pre>
      )}
    </div>
  );
}
