"use client";

import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--apex-red)] text-white hover:bg-[#a80e26] focus-visible:ring-2 focus-visible:ring-[var(--apex-red)]/30 disabled:bg-[var(--apex-red)]/50 disabled:text-white/70",
  secondary:
    "bg-[var(--apex-section-bg)] text-[var(--apex-text-primary)] hover:bg-[var(--apex-border)]",
  ghost:
    "bg-transparent text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)]",
  danger:
    "bg-[var(--apex-red)] text-white hover:bg-[#a80e26]",
  outline:
    "border border-[var(--apex-border)] bg-[var(--apex-surface)] text-[var(--apex-text-primary)] hover:bg-[var(--apex-section-bg)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
