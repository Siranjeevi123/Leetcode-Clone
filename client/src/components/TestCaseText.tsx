interface TestCaseTextProps {
  label: string;
  value: string;
  variant?: "default" | "muted";
}

export default function TestCaseText({
  label,
  value,
  variant = "default",
}: TestCaseTextProps) {
  return (
    <div>
      <span
        className={`font-semibold ${
          variant === "muted" ? "text-on-surface-variant" : ""
        }`}
      >
        {label}
      </span>
      <pre className="mt-1 whitespace-pre-wrap font-mono text-sm text-on-surface break-words">
        {value}
      </pre>
    </div>
  );
}
