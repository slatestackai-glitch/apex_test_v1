import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-5 shadow-[0_2px_12px_rgba(10,37,64,0.05)]",
        className
      )}
      {...props}
    />
  );
}
