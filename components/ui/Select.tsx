import { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border border-[var(--apex-border)] bg-white px-3 text-sm text-[var(--apex-text-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
