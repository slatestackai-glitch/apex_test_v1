"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, ChevronDown, ChevronRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { LeadQualificationStep, QualificationOverride } from "@/components/studio/LeadQualificationStep";
import { industryById } from "@/lib/industries";
import { Phase, StudioInput } from "@/lib/projectSchema";
import { cn } from "@/lib/utils";

type SubTab = "journeys" | "qualification";

export function JourneysQualificationStep({
  value,
  onToggleJourney,
  onPhaseChange,
  onMoveJourney,
  overrides,
  onOverride,
  isAdvanced,
}: {
  value: StudioInput;
  onToggleJourney: (journeyId: string) => void;
  onPhaseChange: (journeyId: string, phase: Phase) => void;
  onMoveJourney: (journeyId: string, direction: "up" | "down") => void;
  overrides: Record<string, QualificationOverride>;
  onOverride: (journeyId: string, value: QualificationOverride) => void;
  isAdvanced: boolean;
}) {
  const [subTab, setSubTab] = useState<SubTab>("journeys");
  const [expandedId, setExpandedId] = useState<string | null>("insurance-get-quote");

  const industry = industryById[value.industry];
  const selectedSet = new Set(value.selectedJourneyIds);
  const selectedJourneys = useMemo(
    () =>
      value.selectedJourneyIds
        .map((id) => industry.journeys.find((j) => j.id === id))
        .filter((j): j is NonNullable<typeof j> => Boolean(j)),
    [industry.journeys, value.selectedJourneyIds]
  );

  const phase1Count = selectedJourneys.filter((j) => value.journeyPhases[j.id] === "Phase 1").length;

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      {/* APEX Insight card */}
      <div className="rounded-2xl border border-[#c8efda] bg-[#f3fbf7] px-5 py-4 flex items-start gap-3">
        <Sparkles className="h-4 w-4 text-[var(--apex-success)] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[var(--apex-text-primary)]">
            APEX recommends {industry.journeys.filter((j) => j.phase === "Phase 1").length} Phase 1 journey{industry.journeys.filter((j) => j.phase === "Phase 1").length > 1 ? "s" : ""} for {value.clientName || industry.defaultClientName}
          </p>
          <p className="text-xs text-[var(--apex-text-secondary)] mt-0.5">
            Based on simulated page analysis of {value.pageUrl || industry.defaultPage}.
            Each journey has pre-built qualification logic, guardrails, and CRM event contracts.
          </p>
        </div>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex items-center gap-1 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-1 self-start">
        <button
          type="button"
          onClick={() => setSubTab("journeys")}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            subTab === "journeys"
              ? "bg-white shadow-sm text-[var(--apex-text-primary)]"
              : "text-[var(--apex-text-secondary)] hover:text-[var(--apex-text-primary)]"
          )}
        >
          Journey selection
          {selectedJourneys.length > 0 && (
            <span className="ml-2 rounded-full bg-[var(--apex-blue)] px-1.5 py-0.5 text-[10px] font-bold text-white">
              {selectedJourneys.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setSubTab("qualification")}
          disabled={selectedJourneys.length === 0}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
            subTab === "qualification"
              ? "bg-white shadow-sm text-[var(--apex-text-primary)]"
              : "text-[var(--apex-text-secondary)] hover:text-[var(--apex-text-primary)]"
          )}
        >
          Qualification logic
          {!isAdvanced && <span className="ml-1.5 text-[10px] text-[var(--apex-text-secondary)]">defaults</span>}
        </button>
      </div>

      {subTab === "journeys" ? (
        <div className="flex flex-col gap-3">
          {/* Selected pipeline */}
          {selectedJourneys.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide">Selected:</span>
              {selectedJourneys.map((j, idx) => (
                <span key={j.id} className="flex items-center gap-1">
                  <span className="rounded-full bg-[var(--apex-blue)] px-2.5 py-1 text-[11px] font-semibold text-white">
                    {j.name}
                  </span>
                  {idx < selectedJourneys.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-slate-300" />
                  )}
                </span>
              ))}
              <span className="text-xs text-[var(--apex-text-secondary)]">
                — {phase1Count} Phase 1 journey{phase1Count !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Journey cards */}
          <div className="flex flex-col gap-2">
            {industry.journeys.map((journey, idx) => {
              const selected = selectedSet.has(journey.id);
              const phase = value.journeyPhases[journey.id] ?? journey.phase;
              const isExpanded = isAdvanced && expandedId === journey.id;

              return (
                <div
                  key={journey.id}
                  className={`rounded-2xl border transition-colors ${
                    selected
                      ? "border-[var(--apex-blue)] bg-white"
                      : "border-[var(--apex-border)] bg-white"
                  }`}
                >
                  {/* Card header — always visible */}
                  <div className="flex items-start gap-3 px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => onToggleJourney(journey.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                        selected
                          ? "border-[var(--apex-blue)] bg-[var(--apex-blue)]"
                          : "border-slate-300 hover:border-[var(--apex-blue)]"
                      }`}
                    >
                      {selected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--apex-text-primary)]">{journey.name}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          phase === "Phase 1" ? "bg-[#e8f1ff] text-[var(--apex-blue)]" : "bg-slate-100 text-slate-500"
                        }`}>{phase}</span>
                        {journey.id === "insurance-get-quote" && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--apex-red)]/10 text-[var(--apex-red)]">
                            Hero
                          </span>
                        )}
                        <Badge className="ml-auto">{journey.complexity}</Badge>
                      </div>
                      <p className="text-xs text-[var(--apex-text-secondary)] mt-1 leading-relaxed">{journey.intent}</p>

                      {selected && (
                        <div className="flex items-center gap-2 mt-2.5">
                          <label className="flex items-center gap-1.5 text-xs text-[var(--apex-text-secondary)]">
                            Phase:
                            <Select
                              className="h-7 text-xs"
                              value={phase}
                              onChange={(e) => onPhaseChange(journey.id, e.target.value as Phase)}
                            >
                              <option value="Phase 1">Phase 1</option>
                              <option value="Phase 2">Phase 2</option>
                            </Select>
                          </label>
                          <button
                            type="button"
                            onClick={() => onMoveJourney(journey.id, "up")}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--apex-border)] hover:bg-[var(--apex-section-bg)]"
                            title="Move up"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onMoveJourney(journey.id, "down")}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--apex-border)] hover:bg-[var(--apex-section-bg)]"
                            title="Move down"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Expand toggle (Advanced only) */}
                    {isAdvanced && (
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : journey.id)}
                        className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--apex-border)] hover:bg-[var(--apex-section-bg)] text-[var(--apex-text-secondary)]"
                      >
                        {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* Expanded detail (Advanced only) */}
                  {isExpanded && (
                    <div className="border-t border-[var(--apex-border)] px-4 py-4 bg-[var(--apex-section-bg)] rounded-b-2xl">
                      <div className="grid gap-3 sm:grid-cols-2 text-xs">
                        <div>
                          <p className="font-semibold text-[var(--apex-text-secondary)] mb-1">User problem</p>
                          <p className="text-[var(--apex-text-primary)]">{journey.userProblem}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--apex-text-secondary)] mb-1">Business value</p>
                          <p className="text-[var(--apex-text-primary)]">{journey.businessValue}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--apex-text-secondary)] mb-1">CRM event</p>
                          <p className="font-mono text-[var(--apex-blue)]">{journey.crmEvent}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--apex-text-secondary)] mb-1">Required fields</p>
                          <p className="text-[var(--apex-text-primary)]">{journey.requiredFields.join(", ")}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="font-semibold text-[var(--apex-text-secondary)] mb-1">Production dependencies</p>
                          <p className="text-[var(--apex-text-primary)]">{journey.productionDependencies.join(", ")}</p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl bg-white border border-[var(--apex-border)] p-3">
                        <p className="text-[10px] font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide mb-2">
                          Sample conversation
                        </p>
                        {journey.sampleConversation.map((line) => (
                          <p key={line} className="text-xs text-[var(--apex-text-primary)] mb-1">{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <LeadQualificationStep
          journeys={selectedJourneys}
          overrides={overrides}
          onOverride={onOverride}
          isAdvanced={isAdvanced}
        />
      )}
    </div>
  );
}
