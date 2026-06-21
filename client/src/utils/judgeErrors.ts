import type { ApiError, JudgeResult } from "../types";

interface TestCaseLike {
  input: string;
  output: string;
}

export function extractJudgeError(
  result: JudgeResult,
  testCase?: TestCaseLike
): string | null {
  if (result.status.id === 3) return null;

  const compileOutput = result.compile_output?.trim();
  if (compileOutput) return compileOutput;

  const stderr = result.stderr?.trim();
  if (stderr) return stderr;

  if (result.status.id === 4) {
    const expected =
      result.expected_output?.trim() ?? testCase?.output?.trim() ?? "";
    const received = result.stdout?.trim() ?? "";
    if (expected || received) {
      return `Expected: ${expected}\nReceived: ${received}`;
    }
  }

  const message = result.message?.trim();
  if (message) return message;

  return result.status.description;
}

export function judgeErrorTitle(result: JudgeResult): string {
  const id = result.status.id;
  if (id === 4) return "Wrong Answer";
  if (id === 5) return "Time Limit Exceeded";
  if (id === 6) return "Compilation Error";
  if (id >= 7 && id <= 12) return "Runtime Error";
  return result.status.description;
}

export function getApiErrorDetail(error: unknown): string {
  if (!error || typeof error !== "object") return "Something went wrong";

  const err = error as ApiError & {
    errorMessage?: string;
    error?: string;
  };

  if (err.errorMessage?.trim()) return err.errorMessage.trim();

  const candidates = [
    err.message,
    typeof err.error === "string" ? err.error : undefined,
    typeof err.err === "string" ? err.err : undefined,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim() && !isAxiosStatusMessage(value)) {
      return value.trim();
    }
  }

  if (err.err && typeof err.err === "object" && "issues" in (err.err as object)) {
    const issues = (err.err as { issues?: { message: string }[] }).issues;
    if (issues?.length) {
      return issues.map((i) => i.message).join("\n");
    }
  }

  if (typeof err.message === "string" && err.message.trim()) {
    if (isAxiosStatusMessage(err.message)) {
      return "The code execution service returned an error. Please try again.";
    }
    return err.message.trim();
  }

  if (err.status === 429) return "Too many requests. Please wait and try again.";
  if (err.status === 401) return "Invalid credentials or session expired.";
  if (err.status === 403) return "You do not have permission for this action.";

  return "Something went wrong";
}

function isAxiosStatusMessage(value: string): boolean {
  return /^Request failed with status code \d+$/.test(value);
}
