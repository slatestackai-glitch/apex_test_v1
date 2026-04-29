"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function StickyActionFooter({
  canGoBack,
  canContinue,
  isFinalStep,
  onBack,
  onSave,
  onContinue,
  onGenerate,
  generating,
}: {
  canGoBack: boolean;
  canContinue: boolean;
  isFinalStep: boolean;
  onBack: () => void;
  onSave: () => void;
  onContinue: () => void;
  onGenerate: () => void;
  generating: boolean;
}) {
  return (
    <div className="sticky bottom-0 z-20 mt-4 border-t border-[var(--apex-border)] bg-[var(--apex-surface)]/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-2">
        <Button variant="secondary" disabled={!canGoBack || generating} onClick={onBack}>
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onSave} disabled={generating}>
            <Save className="h-4 w-4" />
            Save Draft
          </Button>

          {!isFinalStep ? (
            <Button variant="primary" onClick={onContinue} disabled={!canContinue || generating}>
              Continue
            </Button>
          ) : (
            <Button variant="danger" onClick={onGenerate} disabled={!canContinue || generating}>
              {generating ? "Generating package..." : "Generate APEX Demo Package"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
