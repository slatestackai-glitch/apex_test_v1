"use client";

import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

export const studioSteps = [
  { label: "Client Vision", subtitle: "Industry, vertical, client details, and lead definition" },
  { label: "Journeys", subtitle: "Select and configure qualification journeys" },
  { label: "Experience", subtitle: "APEX UI mode, brand colors, tone, and assistant name" },
  { label: "Controls", subtitle: "Behavior prompt, knowledge files, guardrails, and handoff" },
  { label: "Generate", subtitle: "Review configuration and generate the full demo package" },
];

export function StudioStepper({
  currentStep,
  onJump,
}: {
  currentStep: number;
  onJump: (index: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-[var(--apex-border)] bg-[var(--apex-surface)] p-4">
      <div className="mb-3 flex items-center justify-between md:hidden">
        <p className="text-sm font-semibold">
          Step {currentStep + 1} of {studioSteps.length}
        </p>
        <span className="text-xs text-[var(--apex-text-secondary)]">{studioSteps[currentStep].label}</span>
      </div>

      <ol className="hidden grid-cols-5 gap-2 md:grid">
        {studioSteps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <li key={step.label}>
              <button
                type="button"
                onClick={() => onJump(index)}
                className={cn(
                  "w-full rounded-xl border px-3 py-2.5 text-left text-xs transition-colors",
                  isActive
                    ? "border-[var(--apex-red)] bg-[#fff4f6] text-[var(--apex-red)]"
                    : isCompleted
                      ? "border-[#caebdb] bg-[#f2fbf7] text-[var(--apex-success)]"
                      : "border-[var(--apex-border)] bg-[var(--apex-section-bg)] text-[var(--apex-text-secondary)]"
                )}
              >
                <span className="mb-1 flex items-center gap-1.5 font-semibold">
                  {isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                        isActive ? "bg-[var(--apex-red)] text-white" : "bg-[var(--apex-border)] text-[var(--apex-text-secondary)]"
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                  {isCompleted ? "Done" : isActive ? "Current" : "Pending"}
                </span>
                <span className="line-clamp-2 block leading-tight font-medium">{step.label}</span>
                <span className="mt-0.5 line-clamp-2 block text-[10px] leading-tight opacity-70">{step.subtitle}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
