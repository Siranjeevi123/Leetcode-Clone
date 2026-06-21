import type { Submission } from "../types/submission.types";

const toBase64 = (value: string) => Buffer.from(value, "utf-8").toString("base64");

const fromBase64 = (value: string | null | undefined) => {
  if (!value) return value ?? null;
  return Buffer.from(value, "base64").toString("utf-8");
};

export function encodeJudgeSubmission(submission: Submission) {
  return {
    source_code: toBase64(submission.source_code),
    language_id: submission.language_id,
    ...(submission.stdin !== undefined ? { stdin: toBase64(submission.stdin) } : {}),
    ...(submission.expected_output !== undefined
      ? { expected_output: toBase64(submission.expected_output) }
      : {}),
  };
}

export function decodeJudgeResult(result: Record<string, unknown>) {
  return {
    ...result,
    stdout: fromBase64(result.stdout as string | null),
    stderr: fromBase64(result.stderr as string | null),
    compile_output: fromBase64(result.compile_output as string | null),
    message: fromBase64(result.message as string | null),
    stdin: fromBase64(result.stdin as string | null),
    expected_output: fromBase64(result.expected_output as string | null),
  };
}
