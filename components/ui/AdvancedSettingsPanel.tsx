"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp, Settings2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface AdvancedSettingsPanelProps {
  children: ReactNode;
  label?: string;
  subtitle?: string;
  defaultOpen?: boolean;
  className?: string;
}

export function AdvancedSettingsPanel({
  children,
  label = "Advanced settings",
  subtitle = "Fine-tune behavior, logic, and delivery details.",
  defaultOpen = false,
  className,
}: AdvancedSettingsPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)] overflow-hidden transition-shadow",
        open && "shadow-[0_4px_20px_rgba(10,37,64,0.08)]",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--apex-section-bg)] transition-colors"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--apex-red)]/8 border border-[var(--apex-red)]/15">
          <Settings2 className="h-3.5 w-3.5 text-[var(--apex-red)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--apex-text-primary)] leading-tight">{label}</p>
          <p className="text-xs text-[var(--apex-text-secondary)] mt-0.5 leading-relaxed">{subtitle}</p>
        </div>
        <div className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
          open ? "bg-[var(--apex-red)]/10 text-[var(--apex-red)]" : "text-[var(--apex-text-secondary)]"
        )}>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-[var(--apex-border)] bg-[var(--apex-section-bg)]/40 px-5 pb-5 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}
