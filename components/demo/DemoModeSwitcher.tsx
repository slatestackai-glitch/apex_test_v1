"use client";

import { Layers3, LayoutPanelTop, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const modes = [
  { id: "overlay", label: "APEX Overlay", icon: LayoutPanelTop },
  { id: "assist", label: "APEX Assist", icon: Sparkles },
  { id: "page", label: "APEX Page", icon: Layers3 },
] as const;

export type DemoMode = (typeof modes)[number]["id"];

export function DemoModeSwitcher({ mode, onChange }: { mode: DemoMode; onChange: (mode: DemoMode) => void }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--apex-border)] bg-white p-2">
      {modes.map((item) => {
        const Icon = item.icon;
        const active = mode === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
              active ? "bg-[var(--apex-blue)] text-white" : "text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)]"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
