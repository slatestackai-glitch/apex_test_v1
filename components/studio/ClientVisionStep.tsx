"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, X } from "lucide-react";

import { AdvancedSettingsPanel } from "@/components/ui/AdvancedSettingsPanel";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { normalizeLeadDefinition, LEAD_CRITERION_OPTIONS, NormalizedLeadSignal } from "@/lib/leadDefinition";
import {
  INSURANCE_VERTICALS,
  HEALTHCARE_VERTICALS,
  EDTECH_VERTICALS,
  BANKING_VERTICALS,
  IndustryId,
  StudioInput,
} from "@/lib/projectSchema";

const INDUSTRY_CARDS: Array<{
  id: IndustryId;
  label: string;
  tagline: string;
}> = [
  { id: "insurance", label: "Insurance", tagline: "Quotes, renewals, claims, policy comparison" },
  { id: "healthcare", label: "Healthcare", tagline: "Appointments, symptoms, doctor routing" },
  { id: "edtech", label: "Edtech", tagline: "Course discovery, enrollment, counselling" },
  { id: "banking", label: "Banking", tagline: "Account opening, loans, card services" },
];

function getVerticalsForIndustry(industry: IndustryId): readonly string[] {
  switch (industry) {
    case "insurance": return INSURANCE_VERTICALS;
    case "healthcare": return HEALTHCARE_VERTICALS;
    case "edtech": return EDTECH_VERTICALS;
    case "banking": return BANKING_VERTICALS;
    default: return INSURANCE_VERTICALS;
  }
}

const SIGNAL_TYPE_COLORS: Record<NormalizedLeadSignal["type"], string> = {
  contact: "bg-blue-100 text-blue-700",
  intent: "bg-purple-100 text-purple-700",
  product: "bg-orange-100 text-orange-700",
  consent: "bg-green-100 text-green-700",
  callback: "bg-yellow-100 text-yellow-700",
  custom: "bg-gray-100 text-gray-700",
};

export function ClientVisionStep({
  value,
  onChange,
  onIndustryChange,
}: {
  value: StudioInput;
  onChange: (patch: Partial<StudioInput>) => void;
  onIndustryChange: (industryId: IndustryId) => void;
}) {
  const verticals = getVerticalsForIndustry(value.industry);

  // Lead definition state
  const [leadMode, setLeadMode] = useState<"dropdown" | "custom">(value.leadDefinition?.mode ?? "dropdown");
  const [selectedCriterion, setSelectedCriterion] = useState(
    value.leadDefinition?.selectedCriterion ?? "Consent captured + contact captured"
  );
  const [customText, setCustomText] = useState(value.leadDefinition?.customText ?? "");
  const [showCustom, setShowCustom] = useState(false);
  const [dismissedSignals, setDismissedSignals] = useState<string[]>([]);
  const [region, setRegion] = useState("");
  const [trafficSource, setTrafficSource] = useState("");
  const [campaignContext, setCampaignContext] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync lead definition whenever criterion/mode/customText changes
  useEffect(() => {
    if (leadMode === "dropdown") {
      const isCustomOption = selectedCriterion === "Custom definition";
      const effectiveMode = isCustomOption ? "custom" : "dropdown";
      if (isCustomOption) {
        setShowCustom(true);
        return; // wait for custom text
      }
      const normalized = normalizeLeadDefinition({ mode: effectiveMode, selectedCriterion, customText });
      onChange({ leadDefinition: normalized });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCriterion, leadMode]);

  useEffect(() => {
    if (leadMode === "custom" || showCustom) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const normalized = normalizeLeadDefinition({ mode: "custom", selectedCriterion, customText });
        onChange({ leadDefinition: normalized });
      }, 500);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customText, showCustom]);

  const signals = (value.leadDefinition?.normalizedSignals ?? []).filter(
    (s) => !dismissedSignals.includes(s.id)
  );
  const hasSignals = signals.length > 0;

  function handleCriterionChange(criterion: string) {
    setSelectedCriterion(criterion);
    if (criterion === "Custom definition") {
      setShowCustom(true);
      setLeadMode("custom");
    } else {
      setShowCustom(false);
      setLeadMode("dropdown");
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* SECTION 1: Industry + Vertical */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--apex-text-primary)] mb-1">Choose your industry</h2>
        <p className="text-sm text-[var(--apex-text-secondary)] mb-4">
          APEX pre-loads the right journeys, guardrails, and scoring model for your industry.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
          {INDUSTRY_CARDS.map((card) => {
            const isSelected = value.industry === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onIndustryChange(card.id)}
                className={cn(
                  "relative flex flex-col items-start rounded-2xl border-2 p-4 text-left transition-all",
                  isSelected
                    ? "border-[var(--apex-red)] bg-[#fff4f6]"
                    : "border-[var(--apex-border)] bg-white hover:border-[var(--apex-red)]/40"
                )}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-[var(--apex-red)]" />
                )}
                <p className={cn("text-sm font-semibold", isSelected ? "text-[var(--apex-red)]" : "text-[var(--apex-text-primary)]")}>
                  {card.label}
                </p>
                <p className="mt-1 text-[11px] text-[var(--apex-text-secondary)] leading-relaxed">
                  {card.tagline}
                </p>
                {card.id === "insurance" && (
                  <span className="mt-2 inline-block rounded-full bg-[var(--apex-red)]/10 px-2 py-0.5 text-[9px] font-semibold text-[var(--apex-red)]">
                    Recommended
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">
            Vertical
          </span>
          <Select
            value={value.vertical ?? verticals[0]}
            onChange={(e) => onChange({ vertical: e.target.value })}
          >
            {verticals.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </Select>
        </label>
      </section>

      {/* SECTION 2: Client details */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--apex-text-primary)] mb-1">Client details</h2>
        <p className="text-sm text-[var(--apex-text-secondary)] mb-4">
          These fill the demo with real client context — names, URLs.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">
              Client name
            </span>
            <Input
              value={value.clientName}
              placeholder="NovaSure Insurance"
              onChange={(e) => onChange({ clientName: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">
              Website URL
            </span>
            <Input
              value={value.websiteUrl}
              placeholder="https://novasure.in"
              onChange={(e) => onChange({ websiteUrl: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">
              Page URL to transform
            </span>
            <Input
              value={value.pageUrl}
              placeholder="https://novasure.in/get-quote"
              onChange={(e) => onChange({ pageUrl: e.target.value })}
            />
            <span className="text-[11px] text-[var(--apex-text-secondary)]">
              The specific page APEX will enhance — e.g. a quote or contact page.
            </span>
          </label>
        </div>
      </section>

      {/* SECTION 3: Lead Definition */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--apex-text-primary)] mb-1">What counts as a lead?</h2>
        <p className="text-sm text-[var(--apex-text-secondary)] mb-4">
          Define the exact moment a visitor becomes a qualified lead. APEX uses this to configure qualification logic and CRM handoff.
        </p>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">
              Lead criterion
            </span>
            <Select
              value={selectedCriterion}
              onChange={(e) => handleCriterionChange(e.target.value)}
            >
              {LEAD_CRITERION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </Select>
          </label>

          {!showCustom && (
            <button
              type="button"
              onClick={() => { setShowCustom(true); setLeadMode("custom"); }}
              className="self-start text-xs font-medium text-[var(--apex-red)] hover:underline"
            >
              Write my own definition instead
            </button>
          )}

          {showCustom && (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">
                Custom lead definition
              </span>
              <textarea
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. A lead is when the user provides their phone number and gives consent after expressing interest in motor insurance."
                className="w-full rounded-xl border border-[var(--apex-border)] bg-white px-3 py-2.5 text-sm text-[var(--apex-text-primary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--apex-red)]/30"
              />
              <button
                type="button"
                onClick={() => { setShowCustom(false); setLeadMode("dropdown"); }}
                className="self-start text-xs font-medium text-[var(--apex-text-secondary)] hover:underline"
              >
                Use dropdown instead
              </button>
            </label>
          )}

          {/* APEX understood this as card */}
          {hasSignals && (
            <div className="rounded-2xl border border-[var(--apex-success)]/40 bg-[#f2fbf7] p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--apex-success)]" />
                  <p className="text-sm font-semibold text-[var(--apex-text-primary)]">APEX understood this as</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--apex-text-secondary)]">
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    value.leadDefinition?.confidence === "high" ? "bg-green-100 text-green-700" :
                    value.leadDefinition?.confidence === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-600"
                  )}>
                    {value.leadDefinition?.confidence ?? "medium"} confidence
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {signals.map((signal) => (
                  <div
                    key={signal.id}
                    className="flex items-center gap-1.5 rounded-full border border-[var(--apex-border)] bg-white px-3 py-1"
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", signal.required ? "bg-[var(--apex-red)]" : "bg-gray-400")} />
                    <span className="text-xs font-medium text-[var(--apex-text-primary)]">{signal.label}</span>
                    {signal.required && (
                      <span className="text-[10px] font-semibold text-[var(--apex-red)]">required</span>
                    )}
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-semibold", SIGNAL_TYPE_COLORS[signal.type])}>
                      {signal.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDismissedSignals((prev) => [...prev, signal.id])}
                      className="text-gray-400 hover:text-gray-600 ml-0.5"
                      aria-label={`Remove ${signal.label}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-[var(--apex-text-secondary)]">
                <span>
                  <strong className="text-[var(--apex-text-primary)]">Lead stage:</strong>{" "}
                  {value.leadDefinition?.leadStage ?? "qualified-prospect"}
                </span>
                <span>
                  <strong className="text-[var(--apex-text-primary)]">Consent required:</strong>{" "}
                  {value.leadDefinition?.consentRequired ? "Yes" : "No"}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      <AdvancedSettingsPanel subtitle="Target audience, region, traffic source, and campaign context.">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Target audience</span>
            <Input
              value={value.targetUserSegment ?? ""}
              placeholder="e.g. Urban vehicle owners aged 25–45"
              onChange={(e) => onChange({ targetUserSegment: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Region</span>
            <Input
              value={region}
              placeholder="e.g. India — Metro cities"
              onChange={(e) => setRegion(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Traffic source</span>
            <Input
              value={trafficSource}
              placeholder="e.g. Google Ads, Organic Search"
              onChange={(e) => setTrafficSource(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Campaign context</span>
            <Input
              value={campaignContext}
              placeholder="e.g. Q1 2025 Motor campaign"
              onChange={(e) => setCampaignContext(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--apex-text-secondary)]">Demo notes</span>
            <Input
              value={value.demoOwner ?? ""}
              placeholder="Notes for the demo owner"
              onChange={(e) => onChange({ demoOwner: e.target.value })}
            />
          </label>
        </div>
      </AdvancedSettingsPanel>
    </div>
  );
}
