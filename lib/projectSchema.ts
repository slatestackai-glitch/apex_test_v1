import { z } from "zod";

export const INDUSTRY_IDS = ["insurance", "healthcare", "edtech", "banking"] as const;
export const PHASES = ["Phase 1", "Phase 2"] as const;
export const MODE_IDS = ["overlay", "assist", "page"] as const;

export type IndustryId = (typeof INDUSTRY_IDS)[number];
export type Phase = (typeof PHASES)[number];
export type ModeId = (typeof MODE_IDS)[number];

export interface QualificationField {
  id: string;
  label: string;
  type: "text" | "select" | "phone" | "boolean" | "number";
  required: boolean;
  example: string;
  piiLevel: "Low" | "Medium" | "High";
  validationHint: string;
  crmField: string;
  whatsappField: string;
}

export interface Guardrail {
  id: string;
  label: string;
  description: string;
  severity: "High" | "Medium" | "Low";
  fallbackBehavior: string;
}

export interface JourneyTemplate {
  id: string;
  industryId: IndustryId;
  name: string;
  intent: string;
  userProblem: string;
  businessValue: string;
  whyRecommended: string;
  qualificationCriteria: string[];
  requiredFields: string[];
  optionalFields: string[];
  recommendedCTA: string;
  crmEvent: string;
  suggestedMode: "APEX Overlay" | "APEX Assist" | "APEX Page";
  complexity: "Low" | "Medium" | "High";
  feasibility: "Low" | "Medium" | "High";
  phase: Phase;
  guardrails: string[];
  handoff: string[];
  productionDependencies: string[];
  sampleConversation: string[];
  samplePayload: Record<string, unknown>;
}

export interface Industry {
  id: IndustryId;
  name: string;
  description: string;
  recommendedGoals: string[];
  defaultGoal: string;
  defaultConversionAction: string;
  defaultClientName: string;
  defaultWebsite: string;
  defaultPage: string;
  defaultOwner: string;
  defaultTargetSegment: string;
  journeys: JourneyTemplate[];
  guardrails: Guardrail[];
  defaultIntegrations: string[];
  analyticsEvents: string[];
}

export interface Integration {
  id: string;
  name: string;
  type: "CRM" | "Messaging" | "Automation" | "API" | "Knowledge" | "Scheduling";
  simulated: boolean;
  requiredForProduction: boolean;
  credentialsNeeded: string[];
  fieldMappingNeeded: boolean;
  apiDocsNeeded: boolean;
  dataPushed: string[];
  samplePayload: Record<string, unknown>;
  failureFallback: string;
  complexity: "Low" | "Medium" | "High";
  readinessStatus:
    | "Demo simulated"
    | "Ready after credentials"
    | "Mapping required"
    | "API unknown"
    | "Optional Phase 2"
    | "Needs client data"
    | "Needs WhatsApp template approval";
}

export interface ExperienceMode {
  id: ModeId;
  name: "APEX Overlay" | "APEX Assist" | "APEX Page";
  description: string;
  bestFor: string;
  implementationNotes: string;
  demoStrength: "High" | "Medium" | "Low";
  engineeringEffort: "Low" | "Medium" | "High";
  conversionValue: "High" | "Medium" | "Low";
  productionDependency: string;
  recommendedUseCase: string;
}

export interface AnalyticsEvent {
  id: string;
  name: string;
  group: "Discovery" | "Journey" | "Qualification" | "Handoff" | "Fallback";
  trigger: string;
  properties: string[];
  businessPurpose: string;
  priority: "P0" | "P1" | "P2";
  owner: string;
}

export interface ProductionReadinessItem {
  id: string;
  label: string;
  status:
    | "Ready for demo"
    | "Simulated only"
    | "Needs client data"
    | "Needs API credentials"
    | "Needs compliance approval"
    | "Needs WhatsApp template approval"
    | "Needs CRM field mapping";
  owner: string;
  dependency: string;
  risk: string;
  mitigation: string;
}

export interface LeadStageScore {
  label: string;
  points: number;
}

export interface FieldMappingRow {
  apexField: string;
  required: "Yes" | "No";
  piiLevel: "Low" | "Medium" | "High";
  validation: string;
  crmField: string;
  whatsappField: string;
  notes: string;
}

export interface QualificationRule {
  journeyId: string;
  journeyName: string;
  leadStages: string[];
  scoreModel: LeadStageScore[];
  qualifiedThreshold: number;
  requiredFields: string[];
  optionalFields: string[];
  crmEvent: string;
  handoffDestinations: string[];
  consentRequired: boolean;
  fallbackRules: string[];
  humanHandoffTriggers: string[];
  fieldMapping: FieldMappingRow[];
}

export interface QualificationOverrideInput {
  threshold: number;
  crmEvent: string;
  handoffDestination: string;
  consentRequired: boolean;
  scoreModel: Array<{ label: string; points: number }>;
  humanHandoffTriggers: string;
}

export interface BrandSettings {
  clientName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  logoInitials: string;
  assistantName: string;
  tone: string;
  font: string;
  uiDensity: "Compact" | "Balanced" | "Premium";
  ctaStyle: "Solid" | "Outline" | "Soft";
  borderRadius: "Soft" | "Medium" | "Sharp";
  welcomeMessage: string;
}

export interface PromptSettings {
  systemBehaviorPrompt: string;
  conversationStylePrompt: string;
  qualificationPrompt: string;
  fallbackPrompt: string;
  handoffPrompt: string;
}

export interface AnalysisSummary {
  pageType: string;
  friction: string[];
  strategy: string[];
  confidence: {
    intentClarityOpportunity: "High" | "Medium" | "Low";
    qualificationOpportunity: "High" | "Medium" | "Low";
    phase1Feasibility: "High" | "Medium" | "Low";
    integrationComplexity: "High" | "Medium" | "Low";
    complianceSensitivity: "High" | "Medium" | "Low";
  };
  sourceLabels: string[];
}

export interface ImplementationBrief {
  businessObjective: string;
  phase1Scope: string[];
  phase2Scope: string[];
  selectedJourneys: Array<{
    name: string;
    phase: Phase;
    crmEvent: string;
    complexity: string;
    productionDependencies: string[];
  }>;
  leadQualificationSchema: QualificationRule[];
  fieldMapping: FieldMappingRow[];
  crmEvents: Array<{
    event: string;
    trigger: string;
    requiredFields: string[];
    destination: string;
    failureFallback: string;
  }>;
  whatsappHandoffCopy: string;
  knowledgeSourcesNeeded: string[];
  integrationDependencies: Array<{
    name: string;
    readinessStatus: string;
    credentialsNeeded: string[];
    fieldMappingNeeded: boolean;
    complexity: string;
  }>;
  apiRequirements: string[];
  guardrails: string[];
  fallbackBehavior: string[];
  analyticsEvents: Array<{
    name: string;
    trigger: string;
    priority: string;
  }>;
  productionReadinessChecklist: ProductionReadinessItem[];
  riskMatrix: Array<{
    risk: string;
    impact: string;
    owner: string;
    mitigation: string;
    status: string;
  }>;
  openQuestions: string[];
  recommendedNextStep: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  group:
    | "center"
    | "entry"
    | "intent"
    | "journey"
    | "qualification"
    | "mode"
    | "knowledge"
    | "action"
    | "guardrail"
    | "analytics"
    | "handoff"
    | "readiness";
  details: string[];
  phase?: Phase;
  x: number;
  y: number;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface ApexProject {
  id: string;
  createdAt: string;
  client: string;
  website: string;
  pageUrl: string;
  industry: IndustryId;
  goal: string;
  primaryConversionAction: string;
  targetUserSegment: string;
  demoOwner: string;
  selectedJourneys: Array<JourneyTemplate & { phase: Phase }>;
  qualificationRules: QualificationRule[];
  experienceModes: ExperienceMode[];
  selectedPrimaryMode: ModeId;
  brand: BrandSettings;
  knowledgeSources: string[];
  actions: string[];
  guardrails: Guardrail[];
  integrations: Integration[];
  analyticsEvents: AnalyticsEvent[];
  productionReadiness: ProductionReadinessItem[];
  prompts: PromptSettings;
  implementationBrief: ImplementationBrief;
  analysisSummary: AnalysisSummary;
  mindMap: {
    nodes: MindMapNode[];
    edges: MindMapEdge[];
  };
  phaseSummary: {
    phase1: number;
    phase2: number;
  };
  recommendedNextStep: string;
  leadDefinition: LeadDefinition;
  overlayConfig: OverlayConfig;
  assistConfig: AssistConfig;
  pageConfig: PageConfig;
  selectedModeIds: ModeId[];
}

export interface StudioInput {
  industry: IndustryId;
  clientName: string;
  websiteUrl: string;
  pageUrl: string;
  businessGoal: string;
  primaryConversionAction: string;
  targetUserSegment: string;
  demoOwner: string;
  selectedJourneyIds: string[];
  journeyPhases: Record<string, Phase>;
  selectedModeIds: ModeId[];
  selectedPrimaryMode: ModeId;
  brand: BrandSettings;
  knowledgeSources: string[];
  actions: string[];
  guardrailIds: string[];
  prompts: PromptSettings;
  qualificationOverrides?: Record<string, QualificationOverrideInput>;
  vertical: string;
  leadDefinition: LeadDefinition;
  overlayConfig: OverlayConfig;
  assistConfig: AssistConfig;
  pageConfig: PageConfig;
  behaviorPrompt: string;
  detectedIntent: string | null;
  missingInputs: string[];
  confirmedSetupCard: GeneratedSetupCard | null;
  knowledgeFiles: KnowledgeFile[];
  editableGuardrails: string[];
  handoffChannels: HandoffChannel[];
  customJourneys: Array<{
    id: string;
    name: string;
    intent: string;
    whatToCollect: string;
    afterQualification: string;
    phase: "Phase 1" | "Phase 2";
    ctaLabel: string;
  }>;
}

export interface LeadDefinition {
  mode: "dropdown" | "custom";
  selectedCriterion: string;
  customText: string;
  normalizedSignals: Array<{
    id: string;
    label: string;
    type: "contact" | "intent" | "product" | "consent" | "callback" | "custom";
    required: boolean;
  }>;
  consentRequired: boolean;
  leadStage: string;
  confidence: "high" | "medium" | "low";
}

export interface OverlayConfig {
  triggerBehavior: "auto-3s" | "auto-5s" | "cta-click" | "scroll-depth";
  size: "70" | "80" | "full";
  blur: "none" | "light" | "medium" | "strong";
  style: "clean" | "glass" | "premium" | "minimal";
  animation: "fade" | "fade-scale" | "slide-up";
  closeBehavior: "allow-close" | "minimize-pill" | "reopen-cta";
}

export interface AssistConfig {
  nativeJourneyType: "quote-form" | "renewal-form" | "claim-tracker";
  defaultState: "native-first" | "apex-first";
  assistBehavior: "toggle" | "replace" | "inline";
  showComparison: boolean;
}

export interface PageConfig {
  pageType: "campaign" | "product" | "quote-journey";
  heroHeadline: string;
  heroSubcopy: string;
  primaryCtaLabel: string;
  guidedModulePosition: "hero" | "mid-page" | "sticky";
}

export interface KnowledgeFile {
  id: string;
  name: string;
  type: string;
  status: "uploaded" | "processing" | "ready";
}

export interface HandoffChannel {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface GeneratedSetupCard {
  id: string;
  type: string;
  title: string;
  confirmed: boolean;
  fields: Record<string, string>;
}

export type Vertical = string;

export const INSURANCE_VERTICALS = ["Motor insurance", "Health insurance", "Life insurance", "Multi-product insurance"] as const;
export const HEALTHCARE_VERTICALS = ["Specialty discovery", "Consultation booking", "Location routing", "Callback capture"] as const;
export const EDTECH_VERTICALS = ["Course discovery", "Enrollment", "Career counselling", "Scholarship guidance"] as const;
export const BANKING_VERTICALS = ["Account opening", "Personal loans", "Credit cards", "Wealth management"] as const;

export const brandSettingsSchema = z.object({
  clientName: z.string().min(2),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6})$/, "Use hex color"),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6})$/, "Use hex color"),
  logoUrl: z.string().optional(),
  logoInitials: z.string().min(1).max(4),
  assistantName: z.string().min(2),
  tone: z.string().min(2),
  font: z.string().min(2),
  uiDensity: z.enum(["Compact", "Balanced", "Premium"]),
  ctaStyle: z.enum(["Solid", "Outline", "Soft"]),
  borderRadius: z.enum(["Soft", "Medium", "Sharp"]),
  welcomeMessage: z.string().min(10),
});

export const promptSettingsSchema = z.object({
  systemBehaviorPrompt: z.string().min(10),
  conversationStylePrompt: z.string().min(10),
  qualificationPrompt: z.string().min(10),
  fallbackPrompt: z.string().min(10),
  handoffPrompt: z.string().min(10),
});

const qualificationOverrideSchema = z.object({
  threshold: z.number().min(0).max(100),
  crmEvent: z.string().min(2),
  handoffDestination: z.string().min(2),
  consentRequired: z.boolean(),
  scoreModel: z
    .array(
      z.object({
        label: z.string().min(1),
        points: z.number().min(0).max(100),
      })
    )
    .min(1),
  humanHandoffTriggers: z.string().min(2),
});

export const studioInputSchema = z.object({
  industry: z.enum(INDUSTRY_IDS),
  clientName: z.string().min(2),
  websiteUrl: z.string().url(),
  pageUrl: z.string().url(),
  businessGoal: z.string().min(10),
  primaryConversionAction: z.string().min(3),
  targetUserSegment: z.string().min(3),
  demoOwner: z.string().min(2),
  selectedJourneyIds: z.array(z.string()).min(1),
  journeyPhases: z.record(z.string(), z.enum(PHASES)),
  selectedModeIds: z.array(z.enum(MODE_IDS)).min(1),
  selectedPrimaryMode: z.enum(MODE_IDS),
  brand: brandSettingsSchema,
  knowledgeSources: z.array(z.string()).min(1),
  actions: z.array(z.string()).min(1),
  guardrailIds: z.array(z.string()).min(1),
  prompts: promptSettingsSchema,
  qualificationOverrides: z.record(z.string(), qualificationOverrideSchema).optional(),
});

export const projectListItemSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  client: z.string(),
  industry: z.enum(INDUSTRY_IDS),
  goal: z.string(),
  selectedPrimaryMode: z.enum(MODE_IDS),
  phaseSummary: z.object({
    phase1: z.number(),
    phase2: z.number(),
  }),
});

export type ProjectListItem = z.infer<typeof projectListItemSchema>;
