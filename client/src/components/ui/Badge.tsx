import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "primary";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface-container-highest text-on-surface-variant",
  success: "bg-success/15 text-success border border-success/20",
  warning: "bg-warning/15 text-warning border border-warning/20",
  error: "bg-error/15 text-error border border-error/20",
  info: "bg-info/15 text-info border border-info/20",
  primary: "bg-primary-container/15 text-primary border border-primary-container/20",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
