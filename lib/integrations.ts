import { Integration, IndustryId } from "@/lib/projectSchema";

const integrationCatalog: Integration[] = [
  {
    id: "engati-crm",
    name: "Engati CRM",
    type: "CRM",
    simulated: true,
    requiredForProduction: true,
    credentialsNeeded: ["CRM Workspace ID", "API Token"],
    fieldMappingNeeded: true,
    apiDocsNeeded: true,
    dataPushed: ["lead profile", "journey context", "lead score", "consent"],
    samplePayload: {
      event: "qualified_quote_lead",
      leadId: "apx_lead_1032",
      leadScore: 90,
      consent: true,
    },
    failureFallback: "Queue lead payload and notify sales owner.",
    complexity: "Medium",
    readinessStatus: "Mapping required",
  },
  {
    id: "whatsapp-business",
    name: "WhatsApp Business",
    type: "Messaging",
    simulated: true,
    requiredForProduction: true,
    credentialsNeeded: ["Business Account ID", "Approved Templates"],
    fieldMappingNeeded: true,
    apiDocsNeeded: true,
    dataPushed: ["lead name", "journey summary", "callback link"],
    samplePayload: {
      template: "quote_followup_template",
      destination: "+91XXXXXXXXXX",
      context: "Motor insurance quote follow up",
    },
    failureFallback: "Fallback to advisor callback queue.",
    complexity: "Medium",
    readinessStatus: "Needs WhatsApp template approval" as Integration["readinessStatus"],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    type: "CRM",
    simulated: true,
    requiredForProduction: false,
    credentialsNeeded: ["Connected App", "OAuth Credentials"],
    fieldMappingNeeded: true,
    apiDocsNeeded: true,
    dataPushed: ["lead object", "contact preferences", "journey event"],
    samplePayload: {
      object: "Lead",
      fields: ["Phone", "City", "Product_Type__c"],
    },
    failureFallback: "Use Engati CRM as default destination.",
    complexity: "High",
    readinessStatus: "Optional Phase 2",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    type: "CRM",
    simulated: true,
    requiredForProduction: false,
    credentialsNeeded: ["Private App Token"],
    fieldMappingNeeded: true,
    apiDocsNeeded: true,
    dataPushed: ["contact", "deal stage", "source journey"],
    samplePayload: {
      objectType: "contacts",
      properties: ["phone", "city", "journey_name"],
    },
    failureFallback: "Push to Engati CRM and retry HubSpot batch.",
    complexity: "Medium",
    readinessStatus: "Optional Phase 2",
  },
  {
    id: "zoho",
    name: "Zoho",
    type: "CRM",
    simulated: true,
    requiredForProduction: false,
    credentialsNeeded: ["OAuth Client", "Module Mapping"],
    fieldMappingNeeded: true,
    apiDocsNeeded: true,
    dataPushed: ["lead capture", "intent type", "journey source"],
    samplePayload: {
      module: "Leads",
      fields: ["Lead_Source", "Phone", "Intent"],
    },
    failureFallback: "Use CSV export and manual import runbook.",
    complexity: "Medium",
    readinessStatus: "Optional Phase 2",
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    type: "Automation",
    simulated: true,
    requiredForProduction: false,
    credentialsNeeded: ["Service Account", "Sheet ID"],
    fieldMappingNeeded: false,
    apiDocsNeeded: false,
    dataPushed: ["lead log", "timestamp", "journey"],
    samplePayload: {
      sheet: "apex_leads",
      row: ["lead_102", "Get Quote", "Qualified"],
    },
    failureFallback: "Buffer rows locally and retry sync.",
    complexity: "Low",
    readinessStatus: "Demo simulated",
  },
  {
    id: "custom-webhook",
    name: "Custom Webhook",
    type: "API",
    simulated: true,
    requiredForProduction: false,
    credentialsNeeded: ["Webhook URL", "Signature Secret"],
    fieldMappingNeeded: true,
    apiDocsNeeded: true,
    dataPushed: ["event", "payload", "metadata"],
    samplePayload: {
      event: "lead_qualified",
      payload: { journey: "Get Quote", score: 90 },
    },
    failureFallback: "Retry with exponential backoff and alert owner.",
    complexity: "Medium",
    readinessStatus: "API unknown",
  },
  {
    id: "rest-api",
    name: "REST API",
    type: "API",
    simulated: true,
    requiredForProduction: true,
    credentialsNeeded: ["Endpoint URL", "Bearer Token"],
    fieldMappingNeeded: true,
    apiDocsNeeded: true,
    dataPushed: ["qualification payload", "consent", "journey state"],
    samplePayload: {
      endpoint: "/v1/leads",
      body: {
        event: "qualified_quote_lead",
        city: "Mumbai",
      },
    },
    failureFallback: "Queue payload and notify integration owner.",
    complexity: "High",
    readinessStatus: "Ready after credentials",
  },
  {
    id: "calendar-system",
    name: "Calendar / Appointment System",
    type: "Scheduling",
    simulated: true,
    requiredForProduction: false,
    credentialsNeeded: ["Calendar API Key"],
    fieldMappingNeeded: false,
    apiDocsNeeded: true,
    dataPushed: ["callback slot", "advisor assignment"],
    samplePayload: {
      intent: "Advisor Callback",
      slot: "Tomorrow 11:00",
    },
    failureFallback: "Collect preferred slot and notify scheduling desk.",
    complexity: "Low",
    readinessStatus: "Optional Phase 2",
  },
  {
    id: "knowledge-upload",
    name: "Knowledge Base Upload",
    type: "Knowledge",
    simulated: true,
    requiredForProduction: true,
    credentialsNeeded: ["Content Owner Approval"],
    fieldMappingNeeded: false,
    apiDocsNeeded: false,
    dataPushed: ["faq entries", "policy docs", "product brochures"],
    samplePayload: {
      source: "policy-documents.pdf",
      status: "indexed",
    },
    failureFallback: "Use static fallback answers until content is approved.",
    complexity: "Low",
    readinessStatus: "Needs client data",
  },
  {
    id: "website-ingestion",
    name: "Website Content Ingestion",
    type: "Knowledge",
    simulated: true,
    requiredForProduction: false,
    credentialsNeeded: ["Allowed domains", "Crawler policy"],
    fieldMappingNeeded: false,
    apiDocsNeeded: false,
    dataPushed: ["page metadata", "cta map", "faq snippets"],
    samplePayload: {
      page: "/get-quote",
      extractedSections: ["hero", "faq", "cta"],
    },
    failureFallback: "Fallback to manually uploaded URL snapshots.",
    complexity: "Medium",
    readinessStatus: "Demo simulated",
  },
];

const defaultIntegrationByIndustry: Record<IndustryId, string[]> = {
  insurance: ["engati-crm", "whatsapp-business", "rest-api", "knowledge-upload", "website-ingestion"],
  healthcare: ["engati-crm", "rest-api", "calendar-system", "knowledge-upload", "website-ingestion"],
  edtech: ["engati-crm", "whatsapp-business", "rest-api", "knowledge-upload", "google-sheets"],
  banking: ["engati-crm", "rest-api", "knowledge-upload", "website-ingestion", "custom-webhook"],
};

export function getIntegrationCatalog() {
  return integrationCatalog;
}

export function getIndustryIntegrations(industryId: IndustryId) {
  const ids = new Set(defaultIntegrationByIndustry[industryId]);

  return integrationCatalog.map((integration) => {
    if (!ids.has(integration.id)) {
      return {
        ...integration,
        requiredForProduction: false,
        readinessStatus: "Optional Phase 2" as const,
      };
    }

    return integration;
  });
}
