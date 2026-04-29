"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
}

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tabs.map((tab) => {
        const isActive = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-[var(--apex-blue)] text-white"
                : "bg-[var(--apex-section-bg)] text-[var(--apex-text-secondary)] hover:bg-[#eaf0fa]"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ children }: { children: ReactNode }) {
  return <div className="mt-4">{children}</div>;
}
