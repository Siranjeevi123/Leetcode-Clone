import { useRef, type KeyboardEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Ask AI a question...",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) onSend();
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-app-bg border border-border-subtle rounded-xl p-3 pr-12 text-sm text-on-surface focus:outline-none focus:border-primary-container input-focus-ring resize-none disabled:opacity-60"
      />
      <button
        type="button"
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="absolute bottom-3 right-3 w-8 h-8 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center active:scale-95 transition-all disabled:opacity-40"
        aria-label="Send message"
      >
        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
          send
        </span>
      </button>
      <p className="text-[10px] text-on-surface-variant mt-1 px-1">
        Enter to send · Shift+Enter for newline
      </p>
    </div>
  );
}
