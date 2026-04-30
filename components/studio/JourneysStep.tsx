"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronRight, ChevronUp, Plus, X } from "lucide-react";

import { AdvancedSettingsPanel } from "@/components/ui/AdvancedSettingsPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { recommendJourneys, RecommendedJourney } from "@/lib/journeyRecommendations";
import { StudioInput } from "@/lib/projectSchema";

const COMPLEXITY_COLORS: Record<RecommendedJourney["complexity"], string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-600",
};

interface CustomJourney {
  id: string;
  name: string;
  intent: string;
  whatToCollect: string;
  afterQualification: string;
  ctaLabel: string;
}

export function JourneysStep({
  value,
  onToggleJourney,
  onAddCustomJourney,
  isAdvanced,
}: {
  value: StudioInput;
  onToggleJourney: (id: string) => void;
  onPhaseChange?: (id: string, phase: import("@/lib/projectSchema").Phase) => void;
  onAddCustomJourney: (journey: CustomJourney & { phase: import("@/lib/projectSchema").Phase }) => void;
  isAdvanced: boolean;
}) {
  void isAdvanced;

  const recommended = recommendJourneys(value.leadDefinition?.normalizedSignals ?? [], value.industry);
  const selectedIds = value.selectedJourneyIds ?? [];

  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customDraft, setCustomDraft] = useState<Omit<CustomJourney, "id">>({
    name: "",
    intent: "",
    whatToCollect: "",
    afterQualification: "",
    ctaLabel: "Get started",
  });

  function toggleExpanded(id: string) {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function saveCustomJourney() {
    if (!customDraft.name.trim()) return;
    onAddCustomJourney({
      id: `custom-${Date.now()}`,
      ...customDraft,
      phase: "Phase 1",
    });
    setCustomDraft({ name: "", intent: "", whatToCollect: "", afterQualification: "", ctaLabel: "Get started" });
    setShowCustomModal(false);
  }

  function closeModal() {
    setShowCustomModal(false);
    setCustomDraft({ name: "", intent: "", whatToCollect: "", afterQualification: "", ctaLabel: "Get started" });
  }

  const selectedJourneys = recommended.filter((j) => selectedIds.includes(j.id));
  const leadStage = value.leadDefinition?.leadStage ?? "qualified-prospect";
  const clientName = value.clientName ?? "client";

  type JourneyItem = RecommendedJourney | (CustomJourney & {
    phase: "Phase 1" | "Phase 2";
    whyRecommended?: string;
    supportedSignals: string[];
    handoff: string[];
    requiredFields: string[];
    complexity: RecommendedJourney["complexity"];
  });

  const allJourneys: JourneyItem[] = [
    ...recommended,
    ...(value.customJourneys ?? []).map((cj): JourneyItem => ({
      ...cj,
      supportedSignals: [],
      handoff: [],
      requiredFields: [],
      complexity: "Medium" as const,
    })),
  ];

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* APEX Insight */}
      <div className="rounded-2xl border border-[var(--apex-success)]/30 bg-[#f2fbf7] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--apex-success)] text-white">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--apex-text-primary)]">APEX Insight</p>
            <p className="text-sm text-[var(--apex-text-secondary)] mt-0.5">
              Based on <strong>{leadStage}</strong>, APEX recommends{" "}
              <strong>{recommended.length} journeys</strong> for{" "}
              <strong>{clientName}</strong>. Top matches are highlighted below.
            </p>
          </div>
        </div>
      </div>

      {/* Selected chips */}
      {selectedJourneys.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedJourneys.map((j) => (
            <div
              key={j.id}
              className="flex items-center gap-2 rounded-full bg-[var(--apex-red)]/10 border border-[var(--apex-red)]/20 px-3 py-1.5"
            >
              <span className="text-xs font-semibold text-[var(--apex-red)]">{j.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Journey list */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--apex-text-primary)]">Recommended journeys</h2>
            <p className="text-sm text-[var(--apex-text-secondary)]">
              Select journeys to include in this demo.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomModal(true)}
            className="shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            Custom journey
          </Button>
        </div>

        <div className="flex flex-col gap-2.5">
          {allJourneys.map((journey, index) => {
            const isSelected = selectedIds.includes(journey.id);
            const isExpanded = expandedIds.includes(journey.id);
            const isTop3 = index < 3;
            const rj = journey as RecommendedJourney;

            return (
              <div
                key={journey.id}
                className={cn(
                  "rounded-2xl border transition-all",
                  isSelected
                    ? "border-[var(--apex-red)]/40 bg-[#fff4f6]"
                    : "border-[var(--apex-border)] bg-[var(--apex-surface)]"
                )}
              >
                <div className="flex items-start gap-3 p-4">
                  <button
                    type="button"
                    onClick={() => onToggleJourney(journey.id)}
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                      isSelected
                        ? "border-[var(--apex-red)] bg-[var(--apex-red)] text-white"
                        : "border-[var(--apex-border)] bg-[var(--apex-surface)]"
                    )}
                    aria-label={`${isSelected ? "Deselect" : "Select"} ${journey.name}`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-[var(--apex-text-primary)]">{journey.name}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", COMPLEXITY_COLORS[journey.complexity as RecommendedJourney["complexity"]])}>
                        {journey.complexity}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--apex-text-secondary)]">{journey.intent}</p>
                    {isTop3 && "whyRecommended" in journey && journey.whyRecommended && (
                      <p className="text-[11px] text-[var(--apex-success)] mt-1 font-medium">
                        {journey.whyRecommended}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpanded(journey.id)}
                    className="shrink-0 text-[var(--apex-text-secondary)] hover:text-[var(--apex-text-primary)]"
                    aria-label="Toggle details"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-[var(--apex-border)] bg-[var(--apex-section-bg)]/40 px-4 pb-4 pt-3">
                    <div className="grid gap-3 sm:grid-cols-2 text-xs">
                      {rj.requiredFields?.length > 0 && (
                        <div>
                          <p className="font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide mb-1.5">Required fields</p>
                          <ul className="space-y-1">
                            {rj.requiredFields.map((f) => (
                              <li key={f} className="flex items-center gap-1.5 text-[var(--apex-text-primary)]">
                                <ChevronRight className="h-3 w-3 text-[var(--apex-text-secondary)]" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide mb-1.5">Qualification condition</p>
                        <p className="text-[var(--apex-text-primary)]">All required fields + consent given</p>
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide mb-1.5">Fallback</p>
                        <p className="text-[var(--apex-text-primary)]">Human callback after 3 failed attempts</p>
                      </div>
                      {rj.handoff?.length > 0 && (
                        <div>
                          <p className="font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide mb-1.5">Handoff</p>
                          <p className="text-[var(--apex-text-primary)]">{rj.handoff.join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Saved custom journeys */}
        {(value.customJourneys ?? []).length > 0 && (
          <div className="mt-3 space-y-2">
            {(value.customJourneys ?? []).map((cj) => (
              <div key={cj.id} className="flex items-center gap-3 rounded-xl border border-[var(--apex-border)] bg-[var(--apex-surface)] px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--apex-text-primary)]">{cj.name}</p>
                  <p className="text-xs text-[var(--apex-text-secondary)]">{cj.intent}</p>
                </div>
                <span className="rounded-full bg-[var(--apex-section-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--apex-text-secondary)]">Custom</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Advanced settings */}
      <AdvancedSettingsPanel subtitle="Phone/consent timing, fallback behavior, handoff, and CTA overrides.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-[var(--apex-text-secondary)] mb-1.5">Qualification condition</label>
            <select className="w-full h-10 rounded-xl border border-[var(--apex-border)] px-3 text-sm text-[var(--apex-text-primary)] bg-[var(--apex-surface)] focus:outline-none focus:border-[var(--apex-red)] transition-all">
              <option>All required fields + consent given</option>
              <option>Intent confirmed + contact captured</option>
              <option>Minimum: name + phone</option>
              <option>Custom condition</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--apex-text-secondary)] mb-1.5">When to ask for phone</label>
            <select className="w-full h-10 rounded-xl border border-[var(--apex-border)] px-3 text-sm text-[var(--apex-text-primary)] bg-[var(--apex-surface)] focus:outline-none focus:border-[var(--apex-red)] transition-all">
              <option>After product intent is confirmed</option>
              <option>At start of conversation</option>
              <option>Before handoff only</option>
              <option>After 2 questions answered</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--apex-text-secondary)] mb-1.5">When to ask for consent</label>
            <select className="w-full h-10 rounded-xl border border-[var(--apex-border)] px-3 text-sm text-[var(--apex-text-primary)] bg-[var(--apex-surface)] focus:outline-none focus:border-[var(--apex-red)] transition-all">
              <option>Before CRM push and WhatsApp handoff</option>
              <option>After phone number captured</option>
              <option>At end of conversation</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--apex-text-secondary)] mb-1.5">Fallback behavior</label>
            <select className="w-full h-10 rounded-xl border border-[var(--apex-border)] px-3 text-sm text-[var(--apex-text-primary)] bg-[var(--apex-surface)] focus:outline-none focus:border-[var(--apex-red)] transition-all">
              <option>Ask clarifying question</option>
              <option>Show journey menu</option>
              <option>Offer advisor callback</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--apex-text-secondary)] mb-1.5">Human handoff trigger</label>
            <select className="w-full h-10 rounded-xl border border-[var(--apex-border)] px-3 text-sm text-[var(--apex-text-primary)] bg-[var(--apex-surface)] focus:outline-none focus:border-[var(--apex-red)] transition-all">
              <option>User requests agent or fails 3 questions</option>
              <option>On user request only</option>
              <option>After 2 failed attempts</option>
              <option>On escalation keyword detected</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--apex-text-secondary)] mb-1.5">Save and resume</label>
            <select className="w-full h-10 rounded-xl border border-[var(--apex-border)] px-3 text-sm text-[var(--apex-text-primary)] bg-[var(--apex-surface)] focus:outline-none focus:border-[var(--apex-red)] transition-all">
              <option>Enabled — offer resume on return</option>
              <option>Disabled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--apex-text-secondary)] mb-1.5">Handoff destination</label>
            <input type="text" placeholder="e.g. CRM lead, WhatsApp, callback queue"
              className="w-full h-10 rounded-xl border border-[var(--apex-border)] px-3 text-sm text-[var(--apex-text-primary)] placeholder-[var(--apex-text-secondary)]/50 focus:outline-none focus:border-[var(--apex-red)] transition-all bg-[var(--apex-surface)]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--apex-text-secondary)] mb-1.5">CTA label override</label>
            <input type="text" placeholder="e.g. Start my claim, Get my quote"
              className="w-full h-10 rounded-xl border border-[var(--apex-border)] px-3 text-sm text-[var(--apex-text-primary)] placeholder-[var(--apex-text-secondary)]/50 focus:outline-none focus:border-[var(--apex-red)] transition-all bg-[var(--apex-surface)]" />
          </div>
        </div>
      </AdvancedSettingsPanel>

      {/* Custom journey modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-[var(--apex-surface)] border border-[var(--apex-border)] shadow-2xl shadow-[#0a2540]/20">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[var(--apex-border)] px-6 py-4">
              <div>
                <h3 className="text-base font-semibold text-[var(--apex-text-primary)]">Create custom journey</h3>
                <p className="text-xs text-[var(--apex-text-secondary)] mt-0.5">Define a journey tailored to this client.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-[var(--apex-text-secondary)] hover:bg-[var(--apex-section-bg)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Journey name <span className="text-[var(--apex-red)]">*</span></span>
                  <Input
                    value={customDraft.name}
                    placeholder="e.g. Vehicle Inspection"
                    onChange={(e) => setCustomDraft((d) => ({ ...d, name: e.target.value }))}
                    autoFocus
                  />
                  {customDraft.name === "" && (
                    <span className="text-[11px] text-[var(--apex-text-secondary)]">Required</span>
                  )}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">User intent</span>
                  <Input
                    value={customDraft.intent}
                    placeholder="What does the user want?"
                    onChange={(e) => setCustomDraft((d) => ({ ...d, intent: e.target.value }))}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">CTA label</span>
                  <Input
                    value={customDraft.ctaLabel}
                    placeholder="e.g. Book inspection"
                    onChange={(e) => setCustomDraft((d) => ({ ...d, ctaLabel: e.target.value }))}
                  />
                </label>

                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Required fields</span>
                  <Input
                    value={customDraft.whatToCollect}
                    placeholder="e.g. Vehicle reg., phone number, city"
                    onChange={(e) => setCustomDraft((d) => ({ ...d, whatToCollect: e.target.value }))}
                  />
                </label>

                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Handoff action</span>
                  <Input
                    value={customDraft.afterQualification}
                    placeholder="e.g. Push to CRM, send WhatsApp confirmation"
                    onChange={(e) => setCustomDraft((d) => ({ ...d, afterQualification: e.target.value }))}
                  />
                </label>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 border-t border-[var(--apex-border)] px-6 py-4">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button
                onClick={saveCustomJourney}
                disabled={!customDraft.name.trim()}
              >
                Save journey
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
