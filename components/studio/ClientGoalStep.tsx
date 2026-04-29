"use client";

import { CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { businessGoalOptions, industryById, primaryConversionActions } from "@/lib/industries";
import { IndustryId, StudioInput } from "@/lib/projectSchema";

const INDUSTRY_CARDS: Array<{
  id: IndustryId;
  label: string;
  tagline: string;
  depth: string;
}> = [
  {
    id: "insurance",
    label: "Insurance",
    tagline: "Quotes, renewals, claims, policy comparison",
    depth: "Deepest path — full end-state demo",
  },
  {
    id: "healthcare",
    label: "Healthcare",
    tagline: "Appointments, symptoms, doctor routing",
    depth: "Full journey support",
  },
  {
    id: "edtech",
    label: "Edtech",
    tagline: "Course discovery, enrollment, counselling",
    depth: "Full journey support",
  },
  {
    id: "banking",
    label: "Banking",
    tagline: "Account opening, loans, card services",
    depth: "Full journey support",
  },
];

export function ClientGoalStep({
  value,
  onChange,
  onIndustryChange,
}: {
  value: StudioInput;
  onChange: (patch: Partial<StudioInput>) => void;
  onIndustryChange: (industryId: IndustryId) => void;
}) {
  const industry = industryById[value.industry];

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Industry selection */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--apex-text-primary)]">Choose your industry</h2>
        <p className="text-sm text-[var(--apex-text-secondary)] mt-1 mb-4">
          APEX pre-loads the right journeys, guardrails, and scoring model for your industry.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {INDUSTRY_CARDS.map((card) => {
            const isSelected = value.industry === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onIndustryChange(card.id)}
                className={`group relative flex flex-col items-start rounded-2xl border-2 p-4 text-left transition-all ${
                  isSelected
                    ? "border-[var(--apex-blue)] bg-[#e8f1ff]"
                    : "border-[var(--apex-border)] bg-white hover:border-[var(--apex-blue)]/40 hover:bg-[var(--apex-section-bg)]"
                }`}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-[var(--apex-blue)]" />
                )}
                <p className={`text-sm font-semibold ${isSelected ? "text-[var(--apex-blue)]" : "text-[var(--apex-text-primary)]"}`}>
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
      </div>

      {/* Client details */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--apex-text-primary)]">Client details</h2>
        <p className="text-sm text-[var(--apex-text-secondary)] mt-1 mb-4">
          These fill the demo with real client context — names, URLs, goals.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide">Client name</span>
            <Input
              value={value.clientName}
              placeholder={industry.defaultClientName}
              onChange={(e) => onChange({ clientName: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide">Website URL</span>
            <Input
              value={value.websiteUrl}
              placeholder={industry.defaultWebsite}
              onChange={(e) => onChange({ websiteUrl: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide">Page URL to transform</span>
            <Input
              value={value.pageUrl}
              placeholder={industry.defaultPage}
              onChange={(e) => onChange({ pageUrl: e.target.value })}
            />
            <span className="text-[11px] text-[var(--apex-text-secondary)]">
              The specific page APEX will enhance — e.g. a quote or contact page.
            </span>
          </label>
        </div>
      </div>

      {/* Conversion goal */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--apex-text-primary)]">Conversion goal</h2>
        <p className="text-sm text-[var(--apex-text-secondary)] mt-1 mb-4">
          Tell APEX what a "win" looks like for this client — this shapes qualification logic and CRM events.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide">Business goal</span>
            <Select
              value={value.businessGoal}
              onChange={(e) => onChange({ businessGoal: e.target.value })}
            >
              {businessGoalOptions.map((goal) => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </Select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide">Primary conversion action</span>
            <Select
              value={value.primaryConversionAction}
              onChange={(e) => onChange({ primaryConversionAction: e.target.value })}
            >
              {primaryConversionActions.map((action) => (
                <option key={action} value={action}>{action}</option>
              ))}
            </Select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide">Target user segment</span>
            <Input
              value={value.targetUserSegment}
              placeholder={industry.defaultTargetSegment}
              onChange={(e) => onChange({ targetUserSegment: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--apex-text-secondary)] uppercase tracking-wide">Demo owner</span>
            <Input
              value={value.demoOwner}
              placeholder={industry.defaultOwner}
              onChange={(e) => onChange({ demoOwner: e.target.value })}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
