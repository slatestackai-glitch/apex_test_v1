"use client";

import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { BrandCustomizationStep } from "@/components/studio/BrandCustomizationStep";
import { ExperienceModeStep } from "@/components/studio/ExperienceModeStep";
import { ModeId, StudioInput } from "@/lib/projectSchema";
import { cn } from "@/lib/utils";

type SubTab = "modes" | "brand";

export function ExperienceBrandStep({
  value,
  onToggleMode,
  onPrimaryMode,
  onBrandChange,
  onClientNameChange,
  isAdvanced,
}: {
  value: StudioInput;
  onToggleMode: (modeId: ModeId) => void;
  onPrimaryMode: (modeId: ModeId) => void;
  onBrandChange: (patch: Partial<StudioInput["brand"]>) => void;
  onClientNameChange: (name: string) => void;
  isAdvanced: boolean;
}) {
  const [subTab, setSubTab] = useState<SubTab>("modes");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-2xl border border-[var(--apex-border)] bg-white p-2">
        <button
          type="button"
          onClick={() => setSubTab("modes")}
          className={cn(
            "flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
            subTab === "modes"
              ? "bg-[var(--apex-red)] text-white"
              : "text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)]"
          )}
        >
          APEX Experience Modes
        </button>
        <button
          type="button"
          onClick={() => setSubTab("brand")}
          className={cn(
            "flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
            subTab === "brand"
              ? "bg-[var(--apex-red)] text-white"
              : "text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)]"
          )}
        >
          Brand & UI
        </button>
      </div>

      {!isAdvanced && subTab === "brand" && (
        <Card className="border-[#caebdb] bg-[#f2fbf7]">
          <p className="text-sm font-medium text-[var(--apex-success)]">
            Simple mode: Brand colors, assistant name, and welcome message are pre-filled from industry defaults. Update only what matters for this client.
          </p>
        </Card>
      )}

      {subTab === "modes" ? (
        <ExperienceModeStep value={value} onToggleMode={onToggleMode} onPrimaryMode={onPrimaryMode} />
      ) : (
        <BrandCustomizationStep value={value} onBrandChange={onBrandChange} onClientNameChange={onClientNameChange} />
      )}
    </div>
  );
}
