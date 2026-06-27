import { api } from "./client";
import type { Language } from "../types";

export async function sendAiMessage(
  problemId: string,
  body: { message: string; language: Language; code: string }
) {
  return api<{ success: boolean; reply: string }>(`/ai/chat/${problemId}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
