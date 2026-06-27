import { useCallback, useEffect, useRef, useState } from "react";
import { sendAiMessage } from "../api/ai";
import { getErrorMessage } from "../api/client";
import {
  appendChatMessage,
  clearChat,
  createMessage,
  getChatMessages,
  setChatMessages,
  type ChatMessage,
} from "../store/aiChatStore";
import type { Difficulty, Language } from "../types";

interface UseAiChatOptions {
  problemId: string;
  problemTitle: string;
  difficulty: Difficulty;
  language: Language;
  code: string;
}

function buildApiMessage(userMessage: string, opts: UseAiChatOptions) {
  return `[Context]
Problem: ${opts.problemTitle}
Difficulty: ${opts.difficulty}
Language: ${opts.language}

Current Code:
${opts.code || "(empty)"}

Question:
${userMessage}`;
}

export function useAiChat(opts: UseAiChatOptions) {
  const [messages, setMessagesState] = useState<ChatMessage[]>(() =>
    getChatMessages(opts.problemId)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const pendingSend = useRef<string | null>(null);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    setMessagesState(getChatMessages(opts.problemId));
  }, [opts.problemId]);

  const persist = useCallback(
    (next: ChatMessage[]) => {
      setMessagesState(next);
      setChatMessages(opts.problemId, next);
    },
    [opts.problemId]
  );

  const sendMessage = useCallback(
    async (text: string, displayText?: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      const userMsg = createMessage("user", displayText ?? trimmed);
      const withUser = [...messages, userMsg];
      persist(withUser);
      setLoading(true);

      try {
        const apiMessage = buildApiMessage(trimmed, optsRef.current);
        const { reply } = await sendAiMessage(opts.problemId, {
          message: apiMessage,
          language: optsRef.current.language,
          code: optsRef.current.code,
        });

        const assistantMsg = createMessage("assistant", reply);
        appendChatMessage(opts.problemId, assistantMsg);
        setMessagesState((prev) => [...prev, assistantMsg]);
        setTypingMessageId(assistantMsg.id);
      } catch (err) {
        setError(getErrorMessage(err));
        pendingSend.current = trimmed;
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, opts.problemId, persist]
  );

  const retry = useCallback(() => {
    if (pendingSend.current) {
      const msg = pendingSend.current;
      pendingSend.current = null;
      const withoutLast = messages.filter(
        (m, i) => !(i === messages.length - 1 && m.role === "user")
      );
      persist(withoutLast);
      void sendMessage(msg);
    }
  }, [messages, persist, sendMessage]);

  const clear = useCallback(() => {
    clearChat(opts.problemId);
    setMessagesState([]);
    setError(null);
    pendingSend.current = null;
  }, [opts.problemId]);

  const finishTyping = useCallback(() => {
    setTypingMessageId(null);
  }, []);

  return {
    messages,
    loading,
    error,
    typingMessageId,
    sendMessage,
    retry,
    clear,
    finishTyping,
  };
}
