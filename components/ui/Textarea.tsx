import { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-xl border border-[var(--apex-border)] bg-white px-3 py-2 text-sm text-[var(--apex-text-primary)] placeholder:text-slate-400",
        className
      )}
      {...props}
    />
  );
}
