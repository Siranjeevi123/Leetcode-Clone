interface ErrorResultBlockProps {
  title: string;
  message: string;
}

export default function ErrorResultBlock({ title, message }: ErrorResultBlockProps) {
  return (
    <div className="rounded-lg border border-error/30 bg-error/5 overflow-hidden">
      <div className="px-3 py-2 border-b border-error/20 text-error font-semibold text-sm">
        {title}
      </div>
      <pre className="p-3 text-sm font-mono text-error/90 whitespace-pre-wrap break-words">
        {message}
      </pre>
    </div>
  );
}
