import type { SubmissionStatus } from "../types/submission.types";

export default function mapJudgeStatus(statusId: number): SubmissionStatus {
  if (statusId === 3) return "accepted";
  if (statusId === 4) return "wrong_answer";
  if (statusId === 5) return "time_limit_exceeded";
  if (statusId === 6) return "compilation_error";
  if (statusId >= 7 && statusId <= 12) return "runtime_error";
  return "wrong_answer";
}
