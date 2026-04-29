import { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] px-3 text-sm text-[var(--apex-text-primary)] placeholder:text-[var(--apex-text-secondary)]/50 outline-none transition focus:border-[var(--apex-red)] focus:ring-2 focus:ring-[var(--apex-red)]/15",
        className
      )}
      {...props}
    />
  );
}
