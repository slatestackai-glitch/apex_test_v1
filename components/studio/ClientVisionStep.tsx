"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { AdvancedSettingsPanel } from "@/components/ui/AdvancedSettingsPanel";
import { cn } from "@/lib/utils";
import {
  INSURANCE_VERTICALS, HEALTHCARE_VERTICALS, EDTECH_VERTICALS, BANKING_VERTICALS,
  MAIN_GOALS, IndustryId, MainGoal, StudioInput,
} from "@/lib/projectSchema";

const INDUSTRY_CARDS: Array<{ id: IndustryId; label: string; tagline: string }> = [
  { id: "insurance", label: "Insurance", tagline: "Quotes, renewals, claims, comparisons" },
  { id: "healthcare", label: "Healthcare", tagline: "Appointments, symptoms, doctor routing" },
  { id: "edtech", label: "Edtech", tagline: "Course discovery, enrollment, counselling" },
  { id: "banking", label: "Banking", tagline: "Account opening, loans, card services" },
];

function getVerticals(industry: IndustryId): readonly string[] {
  switch (industry) {
    case "insurance": return INSURANCE_VERTICALS;
    case "healthcare": return HEALTHCARE_VERTICALS;
    case "edtech": return EDTECH_VERTICALS;
    case "banking": return BANKING_VERTICALS;
  }
}

function deriveLeadDefinition(goal: string): string {
  switch (goal) {
    case "Improve quote completion": return "Product selected + quote intent confirmed + phone captured + consent given";
    case "Increase policy renewals": return "Renewal intent + policy or vehicle detail + phone captured + consent given";
    case "Improve advisor callback capture": return "Callback reason + phone number + preferred time + consent given";
    case "Reduce form drop-off": return "Intent identified + minimum required details captured + option to continue later";
    case "Increase qualified leads": return "Intent qualified + contact captured + consent given";
    case "Improve self-service resolution": return "Query resolved or escalation requested with contact captured";
    case "Improve WhatsApp continuation": return "User intent captured + WhatsApp consent given + handoff initiated";
    case "Improve claim/status support": return "Claim intent + policy verified + contact captured + status provided";
    default: return "Contact captured + intent identified + consent given";
  }
}

function parseSignals(leadDef: string): Array<{ label: string; color: string }> {
  const s: Array<{ label: string; color: string }> = [];
  if (/intent|quote|renewal|claim|callback|resolution/i.test(leadDef)) s.push({ label: "Intent signal", color: "bg-purple-100 text-purple-700" });
  if (/contact|phone|whatsapp/i.test(leadDef)) s.push({ label: "Contact signal", color: "bg-blue-100 text-blue-700" });
  if (/product|vehicle|policy|plan/i.test(leadDef)) s.push({ label: "Product / context", color: "bg-orange-100 text-orange-700" });
  if (/consent/i.test(leadDef)) s.push({ label: "Consent required", color: "bg-green-100 text-green-700" });
  if (/time|preferred/i.test(leadDef)) s.push({ label: "Callback preference", color: "bg-yellow-100 text-yellow-700" });
  return s;
}

export function ClientVisionStep({
  value, onChange, onIndustryChange,
}: {
  value: StudioInput;
  onChange: (patch: Partial<StudioInput>) => void;
  onIndustryChange: (id: IndustryId) => void;
}) {
  const verticals = getVerticals(value.industry);
  const [leadEditing, setLeadEditing] = useState(false);
  const [leadDraft, setLeadDraft] = useState("");
  const mainGoal = value.mainGoal ?? "";
  const goalDefinition = value.goalDefinition ?? "";
  const suggestedLead = mainGoal && mainGoal !== "Custom goal" ? deriveLeadDefinition(mainGoal) : "";
  const activeLead = value.derivedLeadText ?? suggestedLead;
  const signals = activeLead ? parseSignals(activeLead) : [];

  useEffect(() => {
    if (mainGoal && mainGoal !== "Custom goal" && !value.derivedLeadText) {
      onChange({ derivedLeadText: deriveLeadDefinition(mainGoal) });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainGoal]);

  function handleGoalSelect(goal: MainGoal | string) {
    const derived = goal !== "Custom goal" ? deriveLeadDefinition(goal) : "";
    onChange({ mainGoal: goal, derivedLeadText: derived });
    setLeadEditing(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C8102E] mb-1">Step 1 — Vision</p>
        <h2 className="text-2xl font-bold text-[#0A2540]">Client and goal</h2>
        <p className="text-sm text-gray-400 mt-1">Define the client, the main goal, and what success looks like before selecting journeys.</p>
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-semibold text-[#0A2540] mb-3">Industry</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {INDUSTRY_CARDS.map((card) => {
            const active = value.industry === card.id;
            return (
              <button key={card.id} type="button" onClick={() => onIndustryChange(card.id)}
                className={cn("rounded-xl border-2 p-3 text-left transition-all",
                  active ? "border-[#C8102E] bg-[#fff4f6]" : "border-gray-100 bg-white hover:border-gray-200")}>
                <p className={cn("text-sm font-semibold", active ? "text-[#C8102E]" : "text-[#0A2540]")}>{card.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{card.tagline}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Client details */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
        <p className="text-sm font-semibold text-[#0A2540]">Client details</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            { label: "Client name", key: "clientName", type: "text", placeholder: "e.g. NovaSure Insurance" },
            { label: "Website URL", key: "websiteUrl", type: "url", placeholder: "https://example.com" },
            { label: "Landing page URL", key: "pageUrl", type: "url", placeholder: "https://example.com/quote" },
          ] as const).map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
              <input type={type} value={(value[key] as string) || ""}
                onChange={(e) => onChange({ [key]: e.target.value })} placeholder={placeholder}
                className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition-all" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Vertical</label>
            <select value={value.vertical ?? ""}
              onChange={(e) => onChange({ vertical: e.target.value })}
              className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] bg-white focus:outline-none focus:border-[#C8102E] transition-all">
              <option value="">Select vertical</option>
              {verticals.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Main goal */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-[#0A2540]">Main goal</p>
          <p className="text-xs text-gray-400 mt-0.5">What is the primary outcome this client wants to drive?</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {MAIN_GOALS.map((goal) => {
            const active = mainGoal === goal;
            return (
              <button key={goal} type="button" onClick={() => handleGoalSelect(goal)}
                className={cn("flex items-center gap-2.5 rounded-xl border-2 px-4 py-2.5 text-left text-sm transition-all",
                  active ? "border-[#C8102E] bg-[#fff4f6] text-[#C8102E] font-semibold"
                    : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200")}>
                <div className={cn("h-3 w-3 rounded-full border-2 shrink-0",
                  active ? "border-[#C8102E] bg-[#C8102E]" : "border-gray-300")} />
                {goal}
              </button>
            );
          })}
        </div>
        {mainGoal && (
          <div className="animate-[slideUp_0.2s_ease]">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">What does success mean for this client?</label>
            <textarea value={goalDefinition}
              onChange={(e) => onChange({ goalDefinition: e.target.value })}
              rows={2}
              placeholder='e.g. "A successful outcome is when the user starts a quote request and provides enough information for an advisor to continue."'
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0A2540] placeholder-gray-300 resize-none focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition-all" />
          </div>
        )}
      </div>

      {/* Derived lead definition */}
      {suggestedLead && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 animate-[slideUp_0.25s_ease]">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-sm font-semibold text-[#0A2540]">Suggested lead definition</p>
              <p className="text-xs text-gray-400 mt-0.5">Derived from your goal. Accept or edit.</p>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#C8102E] uppercase tracking-wider shrink-0">
              <Sparkles className="h-3 w-3" /> Generated
            </span>
          </div>
          {leadEditing ? (
            <div className="space-y-2">
              <textarea value={leadDraft} onChange={(e) => setLeadDraft(e.target.value)} rows={2}
                className="w-full rounded-xl border border-[#C8102E] px-3 py-2.5 text-sm text-[#0A2540] resize-none focus:outline-none focus:ring-2 focus:ring-[#C8102E]/10" />
              <div className="flex gap-2">
                <button type="button"
                  onClick={() => { onChange({ derivedLeadText: leadDraft }); setLeadEditing(false); }}
                  className="h-8 rounded-lg bg-[#C8102E] px-4 text-xs font-semibold text-white hover:bg-[#a80e26] transition-colors">Save</button>
                <button type="button" onClick={() => setLeadEditing(false)}
                  className="h-8 rounded-lg border border-gray-200 px-4 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 mb-3">
                <p className="text-sm text-[#0A2540] leading-relaxed">{activeLead}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {signals.map((s) => (
                  <span key={s.label} className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", s.color)}>{s.label}</span>
                ))}
              </div>
              <button type="button" onClick={() => { setLeadDraft(activeLead); setLeadEditing(true); }}
                className="text-xs font-medium text-[#C8102E] hover:underline">Edit lead definition</button>
            </>
          )}
        </div>
      )}

      {/* Advanced */}
      <AdvancedSettingsPanel>
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            { label: "Target audience", key: "targetUserSegment", placeholder: "e.g. Urban professionals aged 25–45" },
            { label: "Primary conversion action", key: "primaryConversionAction", placeholder: "e.g. Quote request submitted" },
            { label: "Demo owner", key: "demoOwner", placeholder: "e.g. Sales team" },
            { label: "Business goal", key: "businessGoal", placeholder: "e.g. Increase insurance quote conversions" },
          ] as const).map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
              <input type="text" value={(value[key] as string) || ""}
                onChange={(e) => onChange({ [key]: e.target.value })} placeholder={placeholder}
                className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] focus:outline-none focus:border-[#C8102E] transition-all" />
            </div>
          ))}
        </div>
      </AdvancedSettingsPanel>
    </div>
  );
}
