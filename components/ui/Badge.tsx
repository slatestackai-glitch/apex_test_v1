import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Variant = "default" | "info" | "success" | "warning" | "error" | "simulated";

const variantStyles: Record<Variant, string> = {
  default: "bg-[var(--apex-section-bg)] text-[var(--apex-text-secondary)]",
  info: "bg-[#e8f1ff] text-[var(--apex-blue)]",
  success: "bg-[#eafbf1] text-[var(--apex-success)]",
  warning: "bg-[#fff6e6] text-[var(--apex-warning)]",
  error: "bg-[#fdecec] text-[var(--apex-error)]",
  simulated: "bg-[#eef4ff] text-[#2459b8]",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, children, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
