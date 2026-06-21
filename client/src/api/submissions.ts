import { api } from "./client";
import type { JudgeResult, Language, Submission } from "../types";

export async function runCode(problemId: string, body: { code: string; language: Language }) {
  return api<{ success: boolean; results: JudgeResult[] }>(
    `/submission/run/${problemId}`,
    { method: "POST", body: JSON.stringify(body) }
  );
}

export async function submitCode(problemId: string, body: { code: string; language: Language }) {
  return api<{ success: boolean; submission: Submission }>(
    `/submission/submit/${problemId}`,
    { method: "POST", body: JSON.stringify(body) }
  );
}

export async function getSubmissions(problemId: string) {
  return api<{ success: boolean; submissions: Submission[] }>(
    `/submission/${problemId}`
  );
}
