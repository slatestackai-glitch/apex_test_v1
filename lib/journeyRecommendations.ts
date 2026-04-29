import { NormalizedLeadSignal } from "@/lib/leadDefinition";

export interface RecommendedJourney {
  id: string;
  name: string;
  intent: string;
  whyRecommended: string;
  supportedSignals: string[];
  phase: "Phase 1" | "Phase 2";
  complexity: "Low" | "Medium" | "High";
  requiredFields: string[];
  handoff: string[];
}

const ALL_INSURANCE_JOURNEYS: RecommendedJourney[] = [
  {
    id: "get-quote",
    name: "Get Quote",
    intent: "User wants a motor or health insurance quote",
    whyRecommended: "Primary conversion path — highest intent signal",
    supportedSignals: ["intent", "product", "contact"],
    phase: "Phase 1",
    complexity: "Medium",
    requiredFields: ["Product type", "City", "Phone", "Consent"],
    handoff: ["Engati CRM", "WhatsApp Business"],
  },
  {
    id: "renew-policy",
    name: "Renew Policy",
    intent: "User wants to renew an existing policy",
    whyRecommended: "High retention value, low friction for returning users",
    supportedSignals: ["contact", "consent"],
    phase: "Phase 1",
    complexity: "Low",
    requiredFields: ["Policy number", "Phone", "Consent"],
    handoff: ["Engati CRM", "Email"],
  },
  {
    id: "advisor-callback",
    name: "Advisor Callback",
    intent: "User wants a human advisor to call them",
    whyRecommended: "Captures high-intent users who prefer human guidance",
    supportedSignals: ["callback", "contact"],
    phase: "Phase 1",
    complexity: "Low",
    requiredFields: ["Phone", "Preferred time", "Consent"],
    handoff: ["CRM", "Sales team notification"],
  },
  {
    id: "compare-plans",
    name: "Compare Plans",
    intent: "User wants to compare insurance options",
    whyRecommended: "Supports purchase intent before contact capture",
    supportedSignals: ["intent", "product"],
    phase: "Phase 2",
    complexity: "Medium",
    requiredFields: ["Product type", "Budget range"],
    handoff: ["CRM when contact provided"],
  },
  {
    id: "track-claim",
    name: "Track Claim",
    intent: "User wants status on an existing claim",
    whyRecommended: "Retention and CSAT signal — high CRM dependency",
    supportedSignals: ["contact"],
    phase: "Phase 2",
    complexity: "High",
    requiredFields: ["Claim ID", "Phone"],
    handoff: ["Claims system"],
  },
  {
    id: "policy-copy",
    name: "Policy Copy",
    intent: "User needs a copy of their insurance document",
    whyRecommended: "Service journey — low complexity",
    supportedSignals: ["contact"],
    phase: "Phase 2",
    complexity: "Low",
    requiredFields: ["Policy number", "Email"],
    handoff: ["Email delivery"],
  },
  {
    id: "addons-riders",
    name: "Add-ons / Riders",
    intent: "User wants to enhance an existing policy",
    whyRecommended: "Upsell opportunity after quote or renewal",
    supportedSignals: ["product", "intent"],
    phase: "Phase 2",
    complexity: "Medium",
    requiredFields: ["Policy number", "Phone"],
    handoff: ["CRM", "WhatsApp"],
  },
];

export function recommendJourneys(signals: NormalizedLeadSignal[], industry: string): RecommendedJourney[] {
  if (industry !== "insurance") return ALL_INSURANCE_JOURNEYS.slice(0, 3);

  const signalTypes = new Set(signals.map(s => s.type));
  const scored: Array<{ journey: RecommendedJourney; score: number }> = [];

  for (const journey of ALL_INSURANCE_JOURNEYS) {
    let score = 0;
    for (const signal of journey.supportedSignals) {
      if (signalTypes.has(signal as NormalizedLeadSignal["type"])) score += 2;
    }
    // Phase 1 journeys get a boost
    if (journey.phase === "Phase 1") score += 1;
    scored.push({ journey, score });
  }

  return scored.sort((a, b) => b.score - a.score).map(s => s.journey);
}
