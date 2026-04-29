// Types
export type LeadSignalType = "contact" | "intent" | "product" | "consent" | "callback" | "custom";

export interface NormalizedLeadSignal {
  id: string;
  label: string;
  type: LeadSignalType;
  required: boolean;
}

export interface LeadDefinition {
  mode: "dropdown" | "custom";
  selectedCriterion: string;
  customText: string;
  normalizedSignals: NormalizedLeadSignal[];
  consentRequired: boolean;
  leadStage: string;
  confidence: "high" | "medium" | "low";
}

// Dropdown options
export const LEAD_CRITERION_OPTIONS = [
  "Contact captured",
  "Purchase intent identified",
  "Product selected + contact captured",
  "Quote request started",
  "Consent captured + contact captured",
  "Advisor callback requested",
  "Custom definition",
] as const;

// Deterministic normalization function
export function normalizeLeadDefinition(input: { mode: "dropdown" | "custom"; selectedCriterion: string; customText: string }): LeadDefinition {
  const text = input.mode === "dropdown" ? input.selectedCriterion : input.customText;
  const lower = text.toLowerCase();

  const signals: NormalizedLeadSignal[] = [];

  if (lower.includes("phone") || lower.includes("contact") || lower.includes("number")) {
    signals.push({ id: "phone", label: "Phone number", type: "contact", required: true });
  }
  if (lower.includes("email")) {
    signals.push({ id: "email", label: "Email address", type: "contact", required: false });
  }
  if (lower.includes("purchase") || lower.includes("buy") || lower.includes("quote") || lower.includes("intent") || lower.includes("request started")) {
    signals.push({ id: "intent", label: "Purchase intent", type: "intent", required: true });
  }
  if (lower.includes("product") || lower.includes("selected")) {
    signals.push({ id: "product", label: "Product selection", type: "product", required: false });
  }
  if (lower.includes("consent")) {
    signals.push({ id: "consent", label: "Explicit consent", type: "consent", required: true });
  }
  if (lower.includes("callback") || lower.includes("advisor")) {
    signals.push({ id: "callback", label: "Callback request", type: "callback", required: false });
  }
  if (lower.includes("renewal") || lower.includes("renew")) {
    signals.push({ id: "renewal", label: "Renewal intent", type: "intent", required: false });
  }

  // Defaults if nothing matched
  if (signals.length === 0) {
    signals.push({ id: "contact", label: "Contact captured", type: "contact", required: true });
  }

  const consentRequired = lower.includes("consent") || lower.includes("crm") || lower.includes("whatsapp") || lower.includes("contact captured");

  let leadStage = "qualified-prospect";
  if (lower.includes("sales") || lower.includes("purchase")) leadStage = "sales-ready lead";
  else if (lower.includes("callback") || lower.includes("advisor")) leadStage = "high-intent lead";
  else if (lower.includes("quote")) leadStage = "quote-ready lead";

  const confidence = signals.length >= 2 ? "high" : signals.length === 1 ? "medium" : "low";

  return {
    mode: input.mode,
    selectedCriterion: input.selectedCriterion,
    customText: input.customText,
    normalizedSignals: signals,
    consentRequired,
    leadStage,
    confidence,
  };
}

export function getDefaultLeadDefinition(): LeadDefinition {
  return normalizeLeadDefinition({
    mode: "dropdown",
    selectedCriterion: "Consent captured + contact captured",
    customText: "",
  });
}
