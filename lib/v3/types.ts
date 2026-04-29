export type V3Mode = "overlay" | "assist" | "page";

export type V3Industry =
  | "insurance"
  | "healthcare"
  | "edtech"
  | "banking"
  | "ecommerce"
  | "other"
  | "";

export interface V3Journey {
  id: string;
  name: string;
  intent: string;
  qualifies: string;
  isCustom?: boolean;
  selected: boolean;
}

export interface V3ModeConfig {
  overlay: { delaySeconds: number; greeting: string };
  assist: { placement: "hero" | "sticky" };
  page: { inputLabel: string; suggestions: string[] };
}

export interface V3Project {
  id: string;
  // Step 1
  clientName: string;
  industry: V3Industry;
  website: string;
  businessGoal: string;
  targetAudience: string;
  // Step 2
  journeys: V3Journey[];
  // Step 3
  mode: V3Mode | null;
  modeConfig: V3ModeConfig;
  assistantName: string;
  // Step 4
  prompt: string;
  analyzed: boolean;
  // Meta
  generatedAt?: string;
}

export const defaultModeConfig: V3ModeConfig = {
  overlay: { delaySeconds: 4, greeting: "Hi! I can help you find the right plan." },
  assist: { placement: "hero" },
  page: {
    inputLabel: "Ask anything about insurance",
    suggestions: ["Buy car insurance", "Renew my policy", "Talk to an advisor"],
  },
};

export const defaultProject: Omit<V3Project, "id"> = {
  clientName: "",
  industry: "",
  website: "",
  businessGoal: "",
  targetAudience: "",
  journeys: [],
  mode: null,
  modeConfig: defaultModeConfig,
  assistantName: "Ava",
  prompt: "",
  analyzed: false,
};
