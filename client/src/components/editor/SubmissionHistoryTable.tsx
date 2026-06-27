import { LANGUAGE_LABELS, type Submission, type SubmissionStatus } from "../../types";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

interface SubmissionHistoryTableProps {
  submissions: Submission[];
  statusLabel: (status: SubmissionStatus) => string;
  onViewCode: (submission: Submission) => void;
}

function statusVariant(status: SubmissionStatus): "success" | "error" | "warning" | "default" {
  if (status === "accepted") return "success";
  if (status === "pending") return "warning";
  if (status === "wrong_answer" || status === "runtime_error" || status === "compilation_error")
    return "error";
  return "default";
}

export default function SubmissionHistoryTable({
  submissions,
  statusLabel,
  onViewCode,
}: SubmissionHistoryTableProps) {
  if (submissions.length === 0) {
    return (
      <p className="text-sm text-on-surface-variant py-8 text-center">No submissions yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border-subtle">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-surface-container-high border-b border-border-subtle">
            {["Status", "Language", "Runtime", "Memory", "Submitted At", ""].map((h) => (
              <th
                key={h || "action"}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {submissions.map((s) => (
            <tr key={s._id} className="hover:bg-surface-container transition-colors">
              <td className="px-4 py-3">
                <Badge variant={statusVariant(s.status)}>{statusLabel(s.status)}</Badge>
              </td>
              <td className="px-4 py-3 text-on-surface-variant">{LANGUAGE_LABELS[s.language]}</td>
              <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">
                {s.status === "accepted" ? `${(s.runtime * 1000).toFixed(0)}ms` : "—"}
              </td>
              <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">
                {s.status === "accepted" ? `${s.memory}KB` : "—"}
              </td>
              <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">
                {new Date(s.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <Button variant="ghost" size="sm" onClick={() => onViewCode(s)}>
                  View Code
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
