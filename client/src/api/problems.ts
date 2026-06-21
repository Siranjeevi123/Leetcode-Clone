import { api } from "./client";
import type { CreateProblemPayload, ProblemDetail, ProblemListItem } from "../types";

export async function getProblems() {
  return api<{ success: boolean; problems: ProblemListItem[] }>("/problem/");
}

export async function getProblem(id: string) {
  return api<{ success: boolean; problem: ProblemDetail }>(`/problem/${id}`);
}

export async function getSolvedProblems() {
  return api<{ success: boolean; count: number; problems: ProblemListItem[] }>(
    "/problem/user"
  );
}

export async function createProblem(payload: CreateProblemPayload) {
  return api<{ success: boolean; problem: ProblemDetail }>("/problem/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProblem(id: string, payload: CreateProblemPayload) {
  return api<{ success: boolean; problem: ProblemDetail }>(`/problem/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteProblem(id: string) {
  return api<{ success: boolean; message: string }>(`/problem/${id}`, {
    method: "DELETE",
  });
}
