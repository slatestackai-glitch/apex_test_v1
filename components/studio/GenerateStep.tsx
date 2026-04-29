"use client";

import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { StudioInput } from "@/lib/projectSchema";

const GENERATION_STAGES = [
  "Shaping lead definition...",
  "Building journeys...",
  "Preparing experience...",
  "Creating demo site...",
  "Drawing mind map...",
  "Generating brief...",
  "Finalising package...",
];

export function GenerateStep({
  value,
  generating,
  generationStage,
}: {
  value: StudioInput;
  generating: boolean;
  generationStage: number;
}) {
  const signals = value.leadDefinition?.normalizedSignals ?? [];
  const signalText = signals.map((s) => s.label).join(", ") || "contact captured";
  const leadStage = value.leadDefinition?.leadStage ?? "qualified-prospect";

  const selectedJourneyCount = (value.selectedJourneyIds ?? []).length;
  const selectedModes = (value.selectedModeIds ?? ["overlay"]).join(", ");

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* Story summary */}
      {!generating && (
        <div className="rounded-2xl border border-[var(--apex-border)] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)] mb-4">
            Package summary
          </p>

          <div className="space-y-4 text-sm text-[var(--apex-text-primary)]">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-[var(--apex-red)]/10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[var(--apex-red)]">1</span>
              </div>
              <p>
                <strong>{value.clientName || "Client"}</strong> wants to define a lead as:{" "}
                <span className="text-[var(--apex-red)]">{leadStage}</span> — {signalText}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-[var(--apex-red)]/10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[var(--apex-red)]">2</span>
              </div>
              <p>
                APEX will generate <strong>{selectedJourneyCount} journeys</strong> with{" "}
                <strong>{selectedModes}</strong> experience mode{selectedModes.includes(",") ? "s" : ""}.
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-[var(--apex-border)] pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)] mb-3">
              APEX will generate
            </p>
            <ul className="grid gap-2 text-sm text-[var(--apex-text-secondary)]">
              {[
                `${selectedJourneyCount} qualification ${selectedJourneyCount === 1 ? "journey" : "journeys"}`,
                `${selectedModes} experience`,
                "Selected demo modes only",
                "Knowledge and guardrail setup",
                "CRM and WhatsApp handoff behaviour",
                "PDF mind map",
                "Implementation brief",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--apex-success)] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Generation progress */}
      {generating && (
        <div className="rounded-2xl border border-[var(--apex-border)] bg-white p-6">
          <p className="text-sm font-semibold text-[var(--apex-text-primary)] mb-1">Generating your package...</p>
          <p className="text-xs text-[var(--apex-text-secondary)] mb-6">This takes a few seconds.</p>

          <div className="space-y-3">
            {GENERATION_STAGES.map((stage, i) => {
              const isPast = i < generationStage;
              const isCurrent = i === generationStage;

              return (
                <div key={stage} className="flex items-center gap-3">
                  <div className={cn(
                    "h-6 w-6 shrink-0 rounded-full flex items-center justify-center transition-all",
                    isPast ? "bg-[var(--apex-success)]" :
                    isCurrent ? "bg-[var(--apex-red)]" :
                    "bg-[var(--apex-border)]"
                  )}>
                    {isPast ? (
                      <Check className="h-3.5 w-3.5 text-white" />
                    ) : isCurrent ? (
                      <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-white/60" />
                    )}
                  </div>
                  <p className={cn(
                    "text-sm transition-colors",
                    isPast ? "text-[var(--apex-success)] line-through" :
                    isCurrent ? "text-[var(--apex-text-primary)] font-medium" :
                    "text-[var(--apex-text-secondary)]"
                  )}>
                    {stage}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Configuration preview (not generating) */}
      {!generating && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)] mb-2">Client</p>
            <p className="text-sm font-semibold text-[var(--apex-text-primary)]">{value.clientName || "Not set"}</p>
            <p className="text-xs text-[var(--apex-text-secondary)] mt-0.5">{value.industry} · {value.vertical || ""}</p>
          </div>

          <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)] mb-2">Lead definition</p>
            <p className="text-sm font-semibold text-[var(--apex-text-primary)]">{leadStage}</p>
            <p className="text-xs text-[var(--apex-text-secondary)] mt-0.5">
              {signals.length} signal{signals.length !== 1 ? "s" : ""} · {value.leadDefinition?.confidence ?? "medium"} confidence
            </p>
          </div>

          <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)] mb-2">Journeys</p>
            <p className="text-sm font-semibold text-[var(--apex-text-primary)]">{selectedJourneyCount} selected</p>
            <p className="text-xs text-[var(--apex-text-secondary)] mt-0.5">
              {(value.selectedJourneyIds ?? []).filter((id) => (value.journeyPhases ?? {})[id] === "Phase 1").length} Phase 1
              {" · "}
              {(value.selectedJourneyIds ?? []).filter((id) => (value.journeyPhases ?? {})[id] === "Phase 2").length} Phase 2
            </p>
          </div>

          <div className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)] mb-2">Experience</p>
            <p className="text-sm font-semibold text-[var(--apex-text-primary)]">{selectedModes}</p>
            <p className="text-xs text-[var(--apex-text-secondary)] mt-0.5">
              Primary: {value.selectedPrimaryMode}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
