import type { ApiError } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error: ApiError = { status: res.status, ...data };
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth:logout"));
    }
    throw error;
  }

  return data as T;
}

export function getErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") return "Something went wrong";

  const err = error as ApiError & { error?: string };

  if (err.message) return err.message;
  if (typeof err.error === "string") return err.error;
  if (typeof err.err === "string") return err.err;

  if (err.err && typeof err.err === "object" && "issues" in (err.err as object)) {
    const issues = (err.err as { issues?: { message: string }[] }).issues;
    if (issues?.[0]?.message) return issues[0].message;
  }

  if (err.status === 429) return "Too many requests. Please wait and try again.";
  if (err.status === 401) return "Invalid credentials or session expired.";
  if (err.status === 403) return "You do not have permission for this action.";

  return "Something went wrong";
}
