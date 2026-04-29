export interface DetectedIntent {
  label: string;
  requiredCapabilities: string[];
  missingInputs: string[];
}

export interface GeneratedSetupCard {
  id: string;
  type: "workflow" | "crm" | "channel" | "tracking";
  title: string;
  confirmed: boolean;
  fields: {
    channel?: string;
    crm?: string;
    tracking?: string;
    handoffTrigger?: string;
    whatsappTemplate?: string;
    crmDestination?: string;
    trackingTool?: string;
    apiEndpoint?: string;
  };
}

export function detectIntent(prompt: string): DetectedIntent {
  const lower = prompt.toLowerCase();

  const requiredCapabilities: string[] = [];
  const missingInputs: string[] = [];
  let label = "General lead qualification";

  if (lower.includes("outreach")) {
    label = "Workflow Configuration";
    requiredCapabilities.push("Outreach automation");
  }
  if (lower.includes("crm") || lower.includes("lead")) {
    requiredCapabilities.push("CRM handoff");
    missingInputs.push("CRM destination");
    if (!lower.includes("outreach")) label = "Lead qualification and handoff setup";
  }
  if (lower.includes("whatsapp")) {
    requiredCapabilities.push("WhatsApp continuation");
    missingInputs.push("WhatsApp template");
  }
  if (lower.includes("consent")) {
    requiredCapabilities.push("Consent capture");
  }
  if (lower.includes("drop-off") || lower.includes("tracking") || lower.includes("track")) {
    requiredCapabilities.push("Drop-off tracking");
    missingInputs.push("Tracking tool");
  }
  if (lower.includes("api") || lower.includes("backend")) {
    requiredCapabilities.push("API action routing");
    missingInputs.push("API endpoint");
  }
  if (lower.includes("quote")) {
    requiredCapabilities.push("Quote journey");
    if (!label.includes("qualification")) label = "Quote lead qualification";
  }
  if (lower.includes("claim")) {
    requiredCapabilities.push("Claim journey");
  }
  if (lower.includes("qualify") || lower.includes("qualification")) {
    requiredCapabilities.push("Lead qualification");
    if (label === "General lead qualification") label = "Lead qualification and handoff setup";
  }

  if (requiredCapabilities.length === 0) {
    requiredCapabilities.push("Lead qualification", "Contact capture");
  }

  return { label, requiredCapabilities, missingInputs };
}

export function generateSetupCard(intent: DetectedIntent): GeneratedSetupCard {
  return {
    id: `card-${Date.now()}`,
    type: "workflow",
    title: "Workflow setup",
    confirmed: false,
    fields: {
      channel: "WhatsApp",
      crm: "Engati CRM",
      tracking: "None",
      handoffTrigger: "lead qualified",
    },
  };
}
