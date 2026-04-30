"use client";

import { useState } from "react";
import { Sparkles, Check } from "lucide-react";
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

const GOAL_DEFINITION_PRESETS = [
  "User starts a quote request",
  "User requests advisor callback",
  "User completes renewal intent",
  "User selects a product and shares contact",
  "User continues on WhatsApp",
  "User gets routed to the right support journey",
  "Custom success definition",
] as const;

const LEAD_DEFINITION_OPTIONS = [
  "Contact captured",
  "Purchase intent identified",
  "Product selected + contact captured",
  "Quote request started",
  "Consent captured + contact captured",
  "Advisor callback requested",
  "Renewal intent + phone captured",
  "Custom lead definition",
] as const;

const TRAFFIC_SOURCES = ["Organic search", "Paid search", "Social media", "WhatsApp", "Email campaign", "Referral", "Direct"];
const HANDOFF_OPTIONS = ["CRM push", "WhatsApp", "Email", "Advisor callback", "Live chat"];

const cls = {
  select: "w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] bg-white focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition-all",
  input: "w-full h-10 rounded-xl border border-gray-200 px-3 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition-all",
  textarea: "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0A2540] placeholder-gray-300 resize-none focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition-all",
  label: "block text-xs font-medium text-gray-500 mb-1.5",
};

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
  const [goalDefPreset, setGoalDefPreset] = useState<string>("");
  const [leadDefChoice, setLeadDefChoice] = useState<string>("");
  const [customLeadDef, setCustomLeadDef] = useState<string>("");

  const mainGoal = value.mainGoal ?? "";
  const goalDefinition = value.goalDefinition ?? "";
  const suggestedLead = mainGoal && mainGoal !== "Custom goal" ? deriveLeadDefinition(mainGoal) : "";
  const activeLead = value.derivedLeadText ?? suggestedLead;
  const signals = activeLead ? parseSignals(activeLead) : [];

  function handleGoalSelect(goal: string) {
    const derived = goal !== "Custom goal" ? deriveLeadDefinition(goal) : "";
    onChange({ mainGoal: goal as MainGoal, derivedLeadText: derived, goalDefinition: "" });
    setLeadEditing(false);
    setGoalDefPreset("");
    setLeadDefChoice("");
    setCustomLeadDef("");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C8102E] mb-1">Step 1 — Vision</p>
        <h2 className="text-2xl font-bold text-[#0A2540]">Client and goal</h2>
        <p className="text-sm text-gray-400 mt-1">Define the client, the main goal, and what success looks like.</p>
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
              <label className={cls.label}>{label}</label>
              <input type={type} value={(value[key] as string) || ""}
                onChange={(e) => onChange({ [key]: e.target.value })} placeholder={placeholder}
                className={cls.input} />
            </div>
          ))}
          <div>
            <label className={cls.label}>Vertical</label>
            <select value={value.vertical ?? ""} onChange={(e) => onChange({ vertical: e.target.value })}
              className={cls.select}>
              <option value="">Select vertical</option>
              {verticals.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* A. Main Goal */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-[#0A2540]">Main goal</p>
          <p className="text-xs text-gray-400 mt-0.5">What is the primary outcome this client wants to drive?</p>
        </div>
        <div>
          <label className={cls.label}>Select a goal</label>
          <select value={mainGoal} onChange={(e) => handleGoalSelect(e.target.value)} className={cls.select}>
            <option value="">Choose a goal…</option>
            {MAIN_GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        {mainGoal === "Custom goal" && (
          <div className="animate-[slideUp_0.2s_ease]">
            <label className={cls.label}>Describe the client's goal</label>
            <textarea value={goalDefinition} onChange={(e) => onChange({ goalDefinition: e.target.value })}
              rows={3} placeholder="What specific outcome is the client trying to achieve?"
              className={cls.textarea} />
          </div>
        )}
        {mainGoal && mainGoal !== "Custom goal" && (
          <div className="animate-[slideUp_0.2s_ease]">
            <label className={cls.label}>
              Refine this goal{" "}
              <span className="text-gray-300 font-normal">optional</span>
            </label>
            <input type="text" value={goalDefinition}
              onChange={(e) => onChange({ goalDefinition: e.target.value })}
              placeholder="Add any specific nuance or client context…"
              className={cls.input} />
          </div>
        )}
      </div>

      {/* B. Goal Definition — what does success mean */}
      {mainGoal && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4 animate-[slideUp_0.2s_ease]">
          <div>
            <p className="text-sm font-semibold text-[#0A2540]">Goal definition</p>
            <p className="text-xs text-gray-400 mt-0.5">What does success mean for this client?</p>
          </div>
          <div>
            <label className={cls.label}>Select an example</label>
            <select value={goalDefPreset} onChange={(e) => {
              const val = e.target.value;
              setGoalDefPreset(val);
              if (val && val !== "Custom success definition") {
                onChange({ goalDefinition: val });
              }
            }} className={cls.select}>
              <option value="">Choose a preset example…</option>
              {GOAL_DEFINITION_PRESETS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          {goalDefPreset === "Custom success definition" && (
            <div className="animate-[slideUp_0.2s_ease]">
              <label className={cls.label}>Describe what success looks like</label>
              <textarea rows={2} value={goalDefinition}
                onChange={(e) => onChange({ goalDefinition: e.target.value })}
                placeholder='e.g. "A successful outcome is when the user starts a quote and provides enough details for an advisor to continue."'
                className={cls.textarea} />
            </div>
          )}
        </div>
      )}

      {/* C. Lead Definition — manual */}
      {mainGoal && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4 animate-[slideUp_0.2s_ease]">
          <div>
            <p className="text-sm font-semibold text-[#0A2540]">Lead definition</p>
            <p className="text-xs text-gray-400 mt-0.5">What should count as a qualified lead?</p>
          </div>
          <div>
            <label className={cls.label}>Select a lead definition</label>
            <select value={leadDefChoice} onChange={(e) => {
              const val = e.target.value;
              setLeadDefChoice(val);
              if (val && val !== "Custom lead definition") {
                onChange({ derivedLeadText: val });
                setCustomLeadDef("");
              }
            }} className={cls.select}>
              <option value="">Choose or accept suggestion below…</option>
              {LEAD_DEFINITION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          {leadDefChoice === "Custom lead definition" && (
            <div className="animate-[slideUp_0.2s_ease]">
              <label className={cls.label}>Describe your lead definition</label>
              <textarea rows={2} value={customLeadDef}
                onChange={(e) => {
                  setCustomLeadDef(e.target.value);
                  onChange({ derivedLeadText: e.target.value });
                }}
                placeholder='e.g. "Phone number + purchase intent should count as a qualified lead."'
                className={cls.textarea} />
            </div>
          )}
        </div>
      )}

      {/* D. Suggested lead definition */}
      {suggestedLead && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 animate-[slideUp_0.25s_ease]">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-sm font-semibold text-[#0A2540]">Suggested lead definition</p>
              <p className="text-xs text-gray-400 mt-0.5">Derived from your goal. Accept, edit, or replace.</p>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#C8102E] uppercase tracking-wider shrink-0">
              <Sparkles className="h-3 w-3" /> Auto
            </span>
          </div>
          {leadEditing ? (
            <div className="space-y-2">
              <textarea value={leadDraft} onChange={(e) => setLeadDraft(e.target.value)} rows={2}
                className={cn(cls.textarea, "border-[#C8102E]")} />
              <div className="flex gap-2">
                <button type="button"
                  onClick={() => { onChange({ derivedLeadText: leadDraft }); setLeadEditing(false); }}
                  className="h-8 rounded-lg bg-[#C8102E] px-4 text-xs font-semibold text-white hover:bg-[#a80e26] transition-colors">
                  Save
                </button>
                <button type="button" onClick={() => setLeadEditing(false)}
                  className="h-8 rounded-lg border border-gray-200 px-4 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 mb-3">
                <p className="text-sm text-[#0A2540] leading-relaxed">{activeLead}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {signals.map((s) => (
                  <span key={s.label} className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", s.color)}>
                    {s.label}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button"
                  onClick={() => onChange({ derivedLeadText: suggestedLead })}
                  className="flex items-center gap-1.5 h-8 rounded-lg bg-[#f2fbf7] border border-[#caebdb] px-3 text-xs font-semibold text-[#16a34a] hover:bg-[#e8f7f0] transition-colors">
                  <Check className="h-3 w-3" /> Accept suggestion
                </button>
                <button type="button"
                  onClick={() => { setLeadDraft(activeLead); setLeadEditing(true); }}
                  className="h-8 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  Edit
                </button>
                <button type="button"
                  onClick={() => { setLeadDefChoice("Custom lead definition"); setCustomLeadDef(""); onChange({ derivedLeadText: "" }); }}
                  className="h-8 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  Replace with custom
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Advanced */}
      <AdvancedSettingsPanel>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={cls.label}>Target audience</label>
            <input type="text" value={value.targetUserSegment || ""}
              onChange={(e) => onChange({ targetUserSegment: e.target.value })}
              placeholder="e.g. Urban professionals aged 25–45"
              className={cls.input} />
          </div>
          <div>
            <label className={cls.label}>Traffic source</label>
            <select value={value.trafficSource ?? ""} onChange={(e) => onChange({ trafficSource: e.target.value })}
              className={cls.select}>
              <option value="">Select source</option>
              {TRAFFIC_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={cls.label}>Region</label>
            <input type="text" value={value.region ?? ""}
              onChange={(e) => onChange({ region: e.target.value })}
              placeholder="e.g. India — Tier 1 cities"
              className={cls.input} />
          </div>
          <div>
            <label className={cls.label}>Handoff preference</label>
            <select value={value.handoffPreference ?? ""} onChange={(e) => onChange({ handoffPreference: e.target.value })}
              className={cls.select}>
              <option value="">Select handoff type</option>
              {HANDOFF_OPTIONS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={cls.label}>Campaign context</label>
            <textarea rows={2} value={value.campaignContext ?? ""}
              onChange={(e) => onChange({ campaignContext: e.target.value })}
              placeholder="e.g. Running a Q4 motor insurance campaign targeting renewal-due customers"
              className={cls.textarea} />
          </div>
          <div className="sm:col-span-2">
            <label className={cls.label}>Qualification strictness</label>
            <div className="flex gap-2">
              {(["Low", "Medium", "High"] as const).map((level) => (
                <button key={level} type="button"
                  onClick={() => onChange({ qualificationStrictness: level })}
                  className={cn("flex-1 rounded-xl border-2 py-2 text-sm font-semibold transition-all",
                    value.qualificationStrictness === level
                      ? "border-[#C8102E] bg-[#fff4f6] text-[#C8102E]"
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200")}>
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </AdvancedSettingsPanel>
    </div>
  );
}
