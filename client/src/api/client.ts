import type { ApiError } from "../types";
import { getApiErrorDetail } from "../utils/judgeErrors";

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
  const detail = getApiErrorDetail(error);
  const firstLine = detail.split("\n")[0]?.trim();
  return firstLine || detail;
}
