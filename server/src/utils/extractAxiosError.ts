import axios from "axios";

export default function extractAxiosError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) return data.trim();

    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      const message = record.message ?? record.error ?? record.err;
      if (typeof message === "string" && message.trim()) return message.trim();
    }

    if (error.message) return error.message;
  }

  if (error instanceof Error) return error.message;

  return "Internal Server Error";
}
