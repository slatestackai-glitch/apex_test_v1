import type { V3Journey } from "./types";

export const PRESET_JOURNEYS: Omit<V3Journey, "selected">[] = [
  {
    id: "buy-insurance",
    name: "Buy Insurance",
    intent: "User wants to purchase a new policy",
    qualifies: "Vehicle type, coverage preference, phone number",
  },
  {
    id: "renew-policy",
    name: "Renew Policy",
    intent: "User wants to renew an expiring policy",
    qualifies: "Policy number, renewal date, contact details",
  },
  {
    id: "file-claim",
    name: "File a Claim",
    intent: "User needs to report an incident or damage",
    qualifies: "Claim type, policy number, incident details",
  },
  {
    id: "talk-advisor",
    name: "Talk to an Advisor",
    intent: "User wants personalized guidance from a human",
    qualifies: "Contact preference, availability, query type",
  },
  {
    id: "get-quote",
    name: "Get a Quote",
    intent: "User wants pricing without full commitment",
    qualifies: "Coverage requirements, vehicle details, budget range",
  },
];
