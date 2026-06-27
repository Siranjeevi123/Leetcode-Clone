import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "../../store/toastStore";

interface MarkdownRendererProps {
  content: string;
  animate?: boolean;
  onTypingComplete?: () => void;
}

function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
      }}
      className="absolute top-2 right-2 p-1.5 rounded bg-surface-container-high text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
      aria-label="Copy code"
    >
      <span className="material-symbols-outlined text-sm">content_copy</span>
    </button>
  );
}

export default function MarkdownRenderer({
  content,
  animate = false,
  onTypingComplete,
}: MarkdownRendererProps) {
  const [displayed, setDisplayed] = useState(animate ? "" : content);

  useEffect(() => {
    if (!animate) {
      setDisplayed(content);
      return;
    }

    setDisplayed("");
    let i = 0;
    const step = Math.max(1, Math.floor(content.length / 120));
    const interval = setInterval(() => {
      i += step;
      if (i >= content.length) {
        setDisplayed(content);
        clearInterval(interval);
        onTypingComplete?.();
      } else {
        setDisplayed(content.slice(0, i));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [animate, content, onTypingComplete]);

  return (
    <div className="prose prose-invert prose-sm max-w-none text-on-surface [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2 [&_li]:mb-1 [&_code]:text-primary [&_strong]:text-on-surface">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeStr = String(children).replace(/\n$/, "");
          if (match) {
            return (
              <div className="relative group my-2">
                <CopyButton text={codeStr} />
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: "0.5rem",
                    fontSize: "0.8125rem",
                    border: "1px solid #333",
                  }}
                >
                  {codeStr}
                </SyntaxHighlighter>
              </div>
            );
          }
          return (
            <code
              {...props}
              className="bg-surface-container-high px-1 py-0.5 rounded text-primary text-xs font-mono"
            >
              {children}
            </code>
          );
        },
      }}
      >
        {displayed}
      </ReactMarkdown>
    </div>
  );
}
