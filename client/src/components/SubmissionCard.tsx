import type { Submission, SubmissionStatus } from "../types";
import { LANGUAGE_LABELS } from "../types";
import ErrorResultBlock from "./ErrorResultBlock";

interface SubmissionCardProps {
  submission: Submission;
  expanded: boolean;
  onToggle: () => void;
  onLoadCode: () => void;
  statusLabel: (status: SubmissionStatus) => string;
  statusColor: (status: SubmissionStatus) => string;
}

export default function SubmissionCard({
  submission,
  expanded,
  onToggle,
  onLoadCode,
  statusLabel,
  statusColor,
}: SubmissionCardProps) {
  const s = submission;

  return (
    <div
      className={`rounded-lg border transition-colors ${
        expanded
          ? "border-primary/40 bg-surface-container"
          : "border-border-subtle bg-surface-container-low hover:bg-surface-container"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-3 text-left"
      >
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform ${
                expanded ? "rotate-90" : ""
              }`}
            >
              chevron_right
            </span>
            <span className={`font-semibold text-sm ${statusColor(s.status)}`}>
              {statusLabel(s.status)}
            </span>
          </div>
          <span className="text-xs text-on-surface-variant shrink-0">
            {new Date(s.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="text-xs text-on-surface-variant mt-1 flex flex-wrap gap-x-4 gap-y-1 pl-7">
          <span>{LANGUAGE_LABELS[s.language]}</span>
          <span>
            {s.testCasesPassed}/{s.testCasesTotal} passed
          </span>
          {s.status === "accepted" && (
            <span>
              {(s.runtime * 1000).toFixed(0)}ms · {s.memory}KB
            </span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-border-subtle pt-3">
          {s.errorMessage?.trim() && (
            <ErrorResultBlock title={statusLabel(s.status)} message={s.errorMessage.trim()} />
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-widest font-bold text-on-surface-variant">
                Submitted Code
              </span>
              <button
                type="button"
                onClick={onLoadCode}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Load in editor
              </button>
            </div>
            <pre className="max-h-64 overflow-auto rounded-lg border border-border-subtle bg-editor-bg p-3 text-xs font-mono text-on-surface whitespace-pre-wrap">
              {s.code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
