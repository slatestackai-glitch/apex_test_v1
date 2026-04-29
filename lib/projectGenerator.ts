import { getAnalyticsForIndustry } from "@/lib/analytics";
import { experienceModes } from "@/lib/experienceModes";
import { industryById } from "@/lib/industries";
import { getIndustryIntegrations } from "@/lib/integrations";
import { getDefaultLeadDefinition } from "@/lib/leadDefinition";
import { getMockAnalysis } from "@/lib/mockAnalysis";
import { buildMindMap } from "@/lib/mindMap";
import {
  ApexProject,
  BrandSettings,
  FieldMappingRow,
  IndustryId,
  JourneyTemplate,
  ModeId,
  ProductionReadinessItem,
  PromptSettings,
  QualificationOverrideInput,
  QualificationRule,
  StudioInput,
} from "@/lib/projectSchema";

function createProjectId() {
  return `apx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function getDefaultBrand(industryId: IndustryId): BrandSettings {
  const industry = industryById[industryId];
  const initials = industry.defaultClientName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return {
    clientName: industry.defaultClientName,
    primaryColor: "#0B5ED7",
    secondaryColor: "#3B82F6",
    logoInitials: initials,
    assistantName: industryId === "insurance" ? "Ava" : "Apex Assistant",
    tone: "Professional and clear",
    font: "Hind",
    uiDensity: "Balanced",
    ctaStyle: "Solid",
    borderRadius: "Medium",
    welcomeMessage:
      industryId === "insurance"
        ? "Hi, I’m Ava. I can help you get a quote, renew a policy, track a claim, compare plans, or schedule an advisor callback."
        : `Hi, I’m your ${industry.name} assistant. I can guide users to the right journey and qualify leads.`,
  };
}

function getDefaultPrompts(industryId: IndustryId): PromptSettings {
  const industry = industryById[industryId];

  return {
    systemBehaviorPrompt:
      `You are APEX for ${industry.name}. Ask contextual questions before requesting contact details. Capture consent before handoff.`,
    conversationStylePrompt: "Keep responses concise, action-oriented, and operationally clear.",
    qualificationPrompt: "Collect only required fields, update lead score progressively, and stop once threshold is reached.",
    fallbackPrompt: "If required fields are missing, ask one clarifying question before fallback to callback capture.",
    handoffPrompt: "Push structured payload to CRM only after consent; prepare WhatsApp continuation if enabled.",
  };
}

function getDefaultJourneyIds(industryId: IndustryId) {
  const journeys = industryById[industryId].journeys;
  if (industryId === "insurance") {
    return ["insurance-get-quote", "insurance-renew-policy", "insurance-advisor-callback", "insurance-track-claim", "insurance-compare-plans", "insurance-policy-copy", "insurance-addons"];
  }

  return journeys.map((journey) => journey.id);
}

function getDefaultJourneyPhases(industryId: IndustryId): Record<string, "Phase 1" | "Phase 2"> {
  const journeys = industryById[industryId].journeys;

  const mapping: Record<string, "Phase 1" | "Phase 2"> = {};
  journeys.forEach((journey) => {
    mapping[journey.id] = journey.phase;
  });

  if (industryId === "insurance") {
    mapping["insurance-get-quote"] = "Phase 1";
    mapping["insurance-renew-policy"] = "Phase 1";
    mapping["insurance-advisor-callback"] = "Phase 1";
    mapping["insurance-track-claim"] = "Phase 2";
    mapping["insurance-compare-plans"] = "Phase 2";
    mapping["insurance-policy-copy"] = "Phase 2";
    mapping["insurance-addons"] = "Phase 2";
  }

  return mapping;
}

export function createDefaultStudioInput(industryId: IndustryId = "insurance"): StudioInput {
  const industry = industryById[industryId];

  return {
    industry: industryId,
    clientName: industry.defaultClientName,
    websiteUrl: industry.defaultWebsite,
    pageUrl: industry.defaultPage,
    businessGoal:
      industryId === "insurance"
        ? "Increase qualified insurance leads and improve quote/renewal completion"
        : industry.defaultGoal,
    primaryConversionAction:
      industryId === "insurance" ? "Generate qualified quote lead" : industry.defaultConversionAction,
    targetUserSegment: industry.defaultTargetSegment,
    demoOwner: industry.defaultOwner,
    selectedJourneyIds: getDefaultJourneyIds(industryId),
    journeyPhases: getDefaultJourneyPhases(industryId),
    selectedModeIds: ["overlay", "assist", "page"],
    selectedPrimaryMode: "overlay",
    brand: getDefaultBrand(industryId),
    knowledgeSources: ["Website content", "FAQs", "Product brochures", "Policy/service documents", "CRM records"],
    actions: ["Capture lead", "Push lead to CRM", "Start WhatsApp journey", "Schedule callback", "Notify sales team"],
    guardrailIds: industry.guardrails.map((guardrail) => guardrail.id),
    prompts: getDefaultPrompts(industryId),
    vertical: industryId === "insurance" ? "Motor insurance" : "",
    leadDefinition: getDefaultLeadDefinition(),
    overlayConfig: {
      triggerBehavior: "auto-5s",
      size: "80",
      blur: "medium",
      style: "clean",
      animation: "fade-scale",
      closeBehavior: "minimize-pill",
    },
    assistConfig: {
      nativeJourneyType: "quote-form",
      defaultState: "native-first",
      assistBehavior: "toggle",
      showComparison: true,
    },
    pageConfig: {
      pageType: "quote-journey",
      heroHeadline: "Protect what matters. Get guided insurance help in minutes.",
      heroSubcopy: "Answer 3 questions and get a personalised quote instantly.",
      primaryCtaLabel: "Get my quote",
      guidedModulePosition: "hero",
    },
    behaviorPrompt: "I want APEX to qualify insurance quote leads, capture phone and consent, continue on WhatsApp, and send qualified leads to CRM.",
    detectedIntent: null,
    missingInputs: [],
    confirmedSetupCard: null,
    knowledgeFiles: [],
    editableGuardrails: [
      "Do not guarantee premium or policy approval.",
      "Do not guarantee claim settlement timelines.",
      "Do not collect OTP, PIN, password, or CVV.",
      "Do not provide regulated financial or legal advice.",
      "Capture explicit consent before CRM or WhatsApp handoff.",
      "Escalate regulated advice requests to a human advisor.",
    ],
    handoffChannels: [
      { id: "engati-crm", label: "Engati CRM", description: "Push qualified leads to Engati CRM", enabled: true },
      { id: "whatsapp", label: "WhatsApp Business", description: "Continue conversation on WhatsApp after consent", enabled: true },
      { id: "sheets", label: "Google Sheets backup", description: "Backup all leads to a connected sheet", enabled: false },
      { id: "webhook", label: "Custom webhook", description: "Send payload to a custom endpoint", enabled: false },
    ],
    customJourneys: [],
  };
}

function buildInsuranceQualificationRule(journey: JourneyTemplate): QualificationRule {
  const fieldMapping: FieldMappingRow[] = [
    {
      apexField: "Product Type",
      required: "Yes",
      piiLevel: "Low",
      validation: "Must match allowed product",
      crmField: "lead_product_type",
      whatsappField: "product_type",
      notes: "Used for quote routing",
    },
    {
      apexField: "City / Location",
      required: "Yes",
      piiLevel: "Low",
      validation: "Alphabetic with minimum 2 chars",
      crmField: "lead_city",
      whatsappField: "city",
      notes: "Used for nearest advisor routing",
    },
    {
      apexField: "Phone Number",
      required: "Yes",
      piiLevel: "Medium",
      validation: "E.164 or 10-digit locale format",
      crmField: "lead_phone",
      whatsappField: "phone",
      notes: "Required for handoff",
    },
    {
      apexField: "Consent",
      required: "Yes",
      piiLevel: "Low",
      validation: "Explicit affirmative response",
      crmField: "consent_flag",
      whatsappField: "consent",
      notes: "Must be true before handoff",
    },
    {
      apexField: "Product Specific Detail",
      required: "Yes",
      piiLevel: "Low",
      validation: "Motor: reg no or make/model/year",
      crmField: "product_detail",
      whatsappField: "product_detail",
      notes: "Used for qualification completion",
    },
    {
      apexField: "Preferred Callback Time",
      required: "No",
      piiLevel: "Low",
      validation: "Optional HH:MM slot",
      crmField: "callback_slot",
      whatsappField: "callback_slot",
      notes: "Optional advisor follow-up",
    },
  ];

  return {
    journeyId: journey.id,
    journeyName: journey.name,
    leadStages: [
      "Visitor",
      "Intent detected",
      "Product selected",
      "Product detail captured",
      "Contact captured",
      "Consent captured",
      "Qualified lead",
      "Handoff completed",
    ],
    scoreModel: [
      { label: "Intent selected", points: 20 },
      { label: "Product type selected", points: 20 },
      { label: "Product-specific detail captured", points: 20 },
      { label: "City/location captured", points: 10 },
      { label: "Phone captured", points: 20 },
      { label: "Consent captured", points: 10 },
    ],
    qualifiedThreshold: 70,
    requiredFields: ["Product type", "City/location", "Phone number", "Consent", "Product-specific detail"],
    optionalFields: ["Email", "Preferred callback time", "Existing policy status", "Budget range"],
    crmEvent: journey.crmEvent,
    handoffDestinations: ["Engati CRM", "WhatsApp Business"],
    consentRequired: true,
    fallbackRules: [
      "If phone missing, continue journey but mark as partial lead.",
      "If consent missing, do not push to CRM or WhatsApp.",
      "If user asks regulated advice, trigger human handoff.",
      "If API fails, queue lead and notify sales owner.",
      "If required field is incomplete, ask one clarification question before fallback.",
    ],
    humanHandoffTriggers: [
      "Regulated advice request",
      "Dispute resolution request",
      "Claim rejection explanation request",
      "Complaint handling request",
    ],
    fieldMapping,
  };
}

function splitHandoffDestinations(value: string) {
  return value
    .split(/[,+]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitTriggerLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function applyQualificationOverride(rule: QualificationRule, override?: QualificationOverrideInput): QualificationRule {
  if (!override) {
    return rule;
  }

  const destinations = splitHandoffDestinations(override.handoffDestination);
  const triggerLines = splitTriggerLines(override.humanHandoffTriggers);

  return {
    ...rule,
    qualifiedThreshold: override.threshold,
    crmEvent: override.crmEvent.trim() || rule.crmEvent,
    handoffDestinations: destinations.length ? destinations : rule.handoffDestinations,
    consentRequired: override.consentRequired,
    scoreModel: override.scoreModel.length ? override.scoreModel : rule.scoreModel,
    humanHandoffTriggers: triggerLines.length ? triggerLines : rule.humanHandoffTriggers,
  };
}

function buildGenericQualificationRule(journey: JourneyTemplate): QualificationRule {
  const requiredFields = journey.requiredFields;
  const optionalFields = journey.optionalFields;

  const fieldMapping: FieldMappingRow[] = requiredFields.map((field, index) => ({
    apexField: field,
    required: "Yes",
    piiLevel: field.toLowerCase().includes("phone") || field.toLowerCase().includes("email") ? "Medium" : "Low",
    validation: "Required based on journey criteria",
    crmField: `field_${index + 1}`,
    whatsappField: `field_${index + 1}`,
    notes: "Mapped during implementation",
  }));

  optionalFields.forEach((field, index) => {
    fieldMapping.push({
      apexField: field,
      required: "No",
      piiLevel: field.toLowerCase().includes("phone") || field.toLowerCase().includes("email") ? "Medium" : "Low",
      validation: "Optional",
      crmField: `optional_${index + 1}`,
      whatsappField: `optional_${index + 1}`,
      notes: "Capture only if user provides",
    });
  });

  return {
    journeyId: journey.id,
    journeyName: journey.name,
    leadStages: [
      "Visitor",
      "Intent detected",
      "Context captured",
      "Contact captured",
      "Consent captured",
      "Qualified lead",
      "Handoff completed",
    ],
    scoreModel: [
      { label: "Intent detected", points: 25 },
      { label: "Required context captured", points: 25 },
      { label: "Contact captured", points: 30 },
      { label: "Consent captured", points: 20 },
    ],
    qualifiedThreshold: 70,
    requiredFields,
    optionalFields,
    crmEvent: journey.crmEvent,
    handoffDestinations: ["Engati CRM"],
    consentRequired: true,
    fallbackRules: [
      "Ask one clarification question when required field is missing.",
      "If consent missing, keep as partial lead and avoid external handoff.",
      "Trigger advisor callback on repeated confusion.",
    ],
    humanHandoffTriggers: ["Regulated advice request", "Complaint escalation", "Sensitive action request"],
    fieldMapping,
  };
}

function createProductionReadiness(project: {
  integrations: ReturnType<typeof getIndustryIntegrations>;
  guardrails: string[];
}) {
  const readiness: ProductionReadinessItem[] = [
    {
      id: "crm-credentials",
      label: "CRM credentials received",
      status: "Needs API credentials",
      owner: "Client IT + Engati Integration",
      dependency: "Engati CRM workspace and token",
      risk: "Handoff cannot be validated in production",
      mitigation: "Use simulated payload and request credentials during kickoff",
    },
    {
      id: "crm-field-mapping",
      label: "CRM field mapping approved",
      status: "Needs CRM field mapping",
      owner: "CRM Owner",
      dependency: "Lead object and field dictionary",
      risk: "Qualified leads may not route correctly",
      mitigation: "Review mapping table in implementation brief",
    },
    {
      id: "whatsapp-templates",
      label: "WhatsApp templates approved",
      status: "Needs WhatsApp template approval",
      owner: "Messaging Owner",
      dependency: "Template submission and approval",
      risk: "Continuation channel unavailable",
      mitigation: "Fallback to advisor callback",
    },
    {
      id: "knowledge-approved",
      label: "Knowledge sources approved",
      status: "Needs client data",
      owner: "Client Content Owner",
      dependency: "FAQ and policy docs",
      risk: "Answer quality becomes generic",
      mitigation: "Start with approved top 20 FAQs",
    },
    {
      id: "compliance-review",
      label: "Compliance reviewed",
      status: "Needs compliance approval",
      owner: "Compliance",
      dependency: "Guardrails and policy language",
      risk: "Regulated response risk",
      mitigation: "Route regulated requests to advisors",
    },
    {
      id: "analytics-owner",
      label: "Analytics owner assigned",
      status: "Ready for demo",
      owner: "Growth / Analytics",
      dependency: "Event owner list",
      risk: "No measurement accountability",
      mitigation: "Assign event owner in kickoff",
    },
    {
      id: "fallback-owner",
      label: "Fallback owner assigned",
      status: "Ready for demo",
      owner: "Customer Success",
      dependency: "Escalation runbook",
      risk: "Unclear handoff for exceptions",
      mitigation: "Define fallback queue and SLA",
    },
  ];

  if (project.guardrails.length === 0) {
    readiness.push({
      id: "guardrails-missing",
      label: "Guardrails configured",
      status: "Simulated only",
      owner: "Product",
      dependency: "Guardrail rule set",
      risk: "Unsafe or non-compliant prompts",
      mitigation: "Enable standard industry guardrails",
    });
  }

  if (project.integrations.every((integration) => integration.simulated)) {
    readiness.push({
      id: "integration-simulated",
      label: "Integration test execution",
      status: "Simulated only",
      owner: "Engineering",
      dependency: "Real endpoints",
      risk: "No live contract validation",
      mitigation: "Run contract tests once credentials are available",
    });
  }

  return readiness;
}

export function generateApexProject(input: StudioInput): ApexProject {
  const industry = industryById[input.industry];
  const analysisSummary = getMockAnalysis(input.industry);
  const overrides = input.qualificationOverrides ?? {};

  const selectedJourneys = industry.journeys
    .filter((journey) => input.selectedJourneyIds.includes(journey.id))
    .map((journey) => ({
      ...journey,
      phase: input.journeyPhases[journey.id] ?? journey.phase,
      crmEvent: overrides[journey.id]?.crmEvent?.trim() || journey.crmEvent,
    }));

  const selectedPrimaryMode = input.selectedPrimaryMode;
  const modeById = new Set(input.selectedModeIds);
  const selectedModes = experienceModes.filter((mode) => modeById.has(mode.id));

  const selectedGuardrails = industry.guardrails.filter((guardrail) => input.guardrailIds.includes(guardrail.id));

  const qualificationRules = selectedJourneys.map((journey) => {
    const baseRule = journey.id === "insurance-get-quote"
      ? buildInsuranceQualificationRule(journey)
      : buildGenericQualificationRule(journey);

    return applyQualificationOverride(baseRule, overrides[journey.id]);
  });

  const integrations = getIndustryIntegrations(input.industry);
  const analyticsEvents = getAnalyticsForIndustry(input.industry);
  const productionReadiness = createProductionReadiness({
    integrations,
    guardrails: selectedGuardrails.map((guardrail) => guardrail.label),
  });

  const mindMap = buildMindMap({
    client: input.clientName,
    journeys: selectedJourneys,
    modes: selectedModes.map((mode) => mode.name),
    knowledgeSources: input.knowledgeSources,
    actions: input.actions,
    guardrails: selectedGuardrails.map((guardrail) => guardrail.label),
    analyticsEvents,
    productionReadiness,
  });

  const fieldMapping = qualificationRules.flatMap((rule) => rule.fieldMapping);

  const implementationBrief = {
    businessObjective: input.businessGoal,
    phase1Scope: selectedJourneys.filter((journey) => journey.phase === "Phase 1").map((journey) => journey.name),
    phase2Scope: selectedJourneys.filter((journey) => journey.phase === "Phase 2").map((journey) => journey.name),
    selectedJourneys: selectedJourneys.map((journey) => ({
      name: journey.name,
      phase: journey.phase,
      crmEvent: journey.crmEvent,
      complexity: journey.complexity,
      productionDependencies: journey.productionDependencies,
    })),
    leadQualificationSchema: qualificationRules,
    fieldMapping,
    crmEvents: qualificationRules.map((rule) => ({
      event: rule.crmEvent,
      trigger: `Qualification threshold reached for ${rule.journeyName}`,
      requiredFields: rule.requiredFields,
      destination: rule.handoffDestinations.join(" + "),
      failureFallback: "Queue payload and notify sales owner",
    })),
    whatsappHandoffCopy:
      "Thank you for sharing your details. We have prepared your request and an advisor can continue this journey on WhatsApp.",
    knowledgeSourcesNeeded: input.knowledgeSources,
    integrationDependencies: integrations.map((integration) => ({
      name: integration.name,
      readinessStatus: integration.readinessStatus,
      credentialsNeeded: integration.credentialsNeeded,
      fieldMappingNeeded: integration.fieldMappingNeeded,
      complexity: integration.complexity,
    })),
    apiRequirements: [
      "Lead create endpoint with consent field",
      "Journey event endpoint for analytics",
      "Optional quote/renewal API endpoints",
      "Callback scheduling endpoint",
    ],
    guardrails: selectedGuardrails.map((guardrail) => guardrail.description),
    fallbackBehavior: [
      "If required field is missing, ask one clarifying question",
      "If consent is missing, block external handoff",
      "If integration fails, queue lead and alert owner",
      "Escalate regulated advice requests to advisor",
    ],
    analyticsEvents: analyticsEvents.map((event) => ({
      name: event.name,
      trigger: event.trigger,
      priority: event.priority,
    })),
    productionReadinessChecklist: productionReadiness,
    riskMatrix: [
      {
        risk: "Missing CRM credentials",
        impact: "No production handoff",
        owner: "Client IT",
        mitigation: "Collect credentials during kickoff",
        status: "Open",
      },
      {
        risk: "WhatsApp template delays",
        impact: "No continuation channel",
        owner: "Messaging owner",
        mitigation: "Use advisor callback fallback",
        status: "Open",
      },
      {
        risk: "Guardrail gaps",
        impact: "Compliance risk",
        owner: "Compliance",
        mitigation: "Sign off guardrail policy set",
        status: "In review",
      },
    ],
    openQuestions: [
      "Which CRM object and owner assignment logic should be final for Phase 1?",
      "What are approved WhatsApp templates for quote and callback journeys?",
      "Which API contracts are available in client staging environment?",
    ],
    recommendedNextStep:
      "Review APEX Assist before/after flow with the client, then align on Phase 1 implementation with CRM mapping and compliance sign-off.",
  };

  const phase1 = selectedJourneys.filter((journey) => journey.phase === "Phase 1").length;
  const phase2 = selectedJourneys.filter((journey) => journey.phase === "Phase 2").length;

  return {
    id: createProjectId(),
    createdAt: new Date().toISOString(),
    client: input.clientName,
    website: input.websiteUrl,
    pageUrl: input.pageUrl,
    industry: input.industry,
    goal: input.businessGoal,
    primaryConversionAction: input.primaryConversionAction,
    targetUserSegment: input.targetUserSegment,
    demoOwner: input.demoOwner,
    selectedJourneys,
    qualificationRules,
    experienceModes: selectedModes,
    selectedPrimaryMode,
    brand: input.brand,
    knowledgeSources: input.knowledgeSources,
    actions: input.actions,
    guardrails: selectedGuardrails,
    integrations,
    analyticsEvents,
    productionReadiness,
    prompts: input.prompts,
    implementationBrief,
    analysisSummary,
    mindMap,
    phaseSummary: {
      phase1,
      phase2,
    },
    recommendedNextStep:
      "Review the APEX Assist before/after flow with the client, then use the PDF to align on Phase 1 implementation.",
    leadDefinition: input.leadDefinition ?? getDefaultLeadDefinition(),
    overlayConfig: input.overlayConfig ?? { triggerBehavior: "auto-5s", size: "80", blur: "medium", style: "clean", animation: "fade-scale", closeBehavior: "minimize-pill" },
    assistConfig: input.assistConfig ?? { nativeJourneyType: "quote-form", defaultState: "native-first", assistBehavior: "toggle", showComparison: true },
    pageConfig: input.pageConfig ?? { pageType: "quote-journey", heroHeadline: "Protect what matters.", heroSubcopy: "", primaryCtaLabel: "Get started", guidedModulePosition: "hero" },
    selectedModeIds: input.selectedModeIds,
  };
}

export function getIndustryDefaults(industryId: IndustryId) {
  return createDefaultStudioInput(industryId);
}

export function validatePrimaryMode(selectedModeIds: ModeId[], primaryMode: ModeId): ModeId {
  if (selectedModeIds.includes(primaryMode)) {
    return primaryMode;
  }

  return selectedModeIds[0] ?? "overlay";
}
