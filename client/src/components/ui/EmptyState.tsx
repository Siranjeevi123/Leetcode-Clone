import type { ReactNode } from "react";
import Button from "./Button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export default function EmptyState({
  icon = "inbox",
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-[slide-in_0.3s_ease-out]">
      <span className="material-symbols-outlined text-6xl text-border-subtle mb-4">{icon}</span>
      <h3 className="text-xl font-semibold text-on-surface">{title}</h3>
      {description && (
        <p className="text-sm text-on-surface-variant max-w-sm mt-2">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {children}
    </div>
  );
}
