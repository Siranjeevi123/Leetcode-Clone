import MarkdownRenderer from "./MarkdownRenderer";
import type { ChatMessage } from "../../store/aiChatStore";

interface ChatBubbleProps {
  message: ChatMessage;
  animate?: boolean;
  onTypingComplete?: () => void;
}

export default function ChatBubble({ message, animate, onTypingComplete }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isUser) {
    return (
      <div className="flex flex-col items-end animate-[slide-in_0.2s_ease-out]">
        <div className="bg-primary-container text-on-primary-container p-3 rounded-xl rounded-tr-none max-w-[90%]">
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        </div>
        <span className="text-[10px] text-on-surface-variant mt-1">{time}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start animate-[slide-in_0.2s_ease-out]">
      <div className="flex items-center gap-1 mb-1 text-primary">
        <span
          className="material-symbols-outlined text-xs"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest">Assistant</span>
      </div>
      <div className="bg-surface-elevated text-on-surface p-3 rounded-xl rounded-tl-none border border-border-subtle max-w-[95%]">
        <MarkdownRenderer
          content={message.message}
          animate={animate}
          onTypingComplete={onTypingComplete}
        />
      </div>
      <span className="text-[10px] text-on-surface-variant mt-1">{time}</span>
    </div>
  );
}

export function ChatLoadingBubble() {
  return (
    <div className="flex flex-col items-start animate-[slide-in_0.2s_ease-out]">
      <div className="flex items-center gap-1 mb-1 text-primary">
        <span
          className="material-symbols-outlined text-xs"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest">Assistant</span>
      </div>
      <div className="bg-surface-elevated p-4 rounded-xl rounded-tl-none border border-border-subtle flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-primary-container animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
