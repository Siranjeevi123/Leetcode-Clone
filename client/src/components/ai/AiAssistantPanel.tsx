import { useEffect, useRef, useState } from "react";
import ChatBubble, { ChatLoadingBubble } from "./ChatBubble";
import ChatInput from "./ChatInput";
import SuggestedActions from "./SuggestedActions";
import Button from "../ui/Button";
import { useAiChat } from "../../hooks/useAiChat";
import type { Difficulty, Language } from "../../types";

interface AiAssistantPanelProps {
  problemId: string;
  problemTitle: string;
  difficulty: Difficulty;
  language: Language;
  code: string;
  pendingPrompt?: string | null;
  onPendingConsumed?: () => void;
  onClose?: () => void;
}

export default function AiAssistantPanel({
  problemId,
  problemTitle,
  difficulty,
  language,
  code,
  pendingPrompt,
  onPendingConsumed,
  onClose,
}: AiAssistantPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, loading, error, typingMessageId, sendMessage, retry, clear, finishTyping } =
    useAiChat({ problemId, problemTitle, difficulty, language, code });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!pendingPrompt) return;
    const prompt = pendingPrompt;
    onPendingConsumed?.();
    void sendMessage(prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPrompt]);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    void sendMessage(msg);
  };

  const handleSuggestion = (prompt: string) => {
    void sendMessage(prompt);
  };

  return (
    <div className="h-full flex flex-col bg-sidebar">
      <div className="p-3 border-b border-border-subtle flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <h2 className="text-base font-semibold">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="text-xs text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Clear Chat
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Close AI assistant"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>
      </div>

      {messages.length === 0 && !loading && (
        <SuggestedActions onSelect={handleSuggestion} disabled={loading} />
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-4 min-h-0">
        {messages.length === 0 && !loading && (
          <div className="text-center py-8 px-4">
            <span
              className="material-symbols-outlined text-4xl text-primary/40 mb-3"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <p className="text-sm text-on-surface-variant">
              Ask anything about this problem. Your code and context are sent automatically.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            animate={msg.id === typingMessageId && msg.role === "assistant"}
            onTypingComplete={finishTyping}
          />
        ))}

        {loading && <ChatLoadingBubble />}

        {error && (
          <div className="rounded-lg border border-error/30 bg-error/5 p-3 flex items-center justify-between gap-2">
            <p className="text-xs text-error">{error}</p>
            <Button variant="secondary" size="sm" onClick={retry}>
              Retry
            </Button>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border-subtle shrink-0">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={loading}
        />
        <p className="text-[10px] text-on-surface-variant italic mt-2 px-1">
          AI can make mistakes. Verify code before using.
        </p>
      </div>
    </div>
  );
}
