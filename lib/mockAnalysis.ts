import { AnalysisSummary, IndustryId } from "@/lib/projectSchema";

const baseSources = [
  "Simulated page-structure signal",
  "Engati journey patterns",
  "Industry benchmark patterns",
  "Recommended Phase 1 scope",
];

const summaries: Record<IndustryId, AnalysisSummary> = {
  insurance: {
    pageType: "Insurance product / quote landing page",
    friction: [
      "Quote and renewal intent may be mixed.",
      "Contact capture likely happens before intent clarity.",
      "Users may face too many fields before understanding product fit.",
      "Advisor callback is not surfaced early enough.",
      "WhatsApp continuation is not used as a structured handoff.",
      "Form-only submission delays CRM-ready qualification.",
    ],
    strategy: [
      "Use APEX Overlay as the fastest conversion layer over the native page.",
      "Use APEX Assist to show before/after friction reduction.",
      "Use APEX Page for campaign or microsite journeys.",
      "Start Phase 1 with Quote, Renewal, and Advisor Callback.",
      "Use progressive qualification before requesting unnecessary fields.",
    ],
    confidence: {
      intentClarityOpportunity: "High",
      qualificationOpportunity: "High",
      phase1Feasibility: "High",
      integrationComplexity: "Medium",
      complianceSensitivity: "Medium",
    },
    sourceLabels: baseSources,
  },
  healthcare: {
    pageType: "Healthcare appointment and specialty routing page",
    friction: [
      "Users struggle to identify the right specialty before booking.",
      "Forms request detailed inputs before triaging intent.",
      "Emergency escalation pathways are not explicit.",
    ],
    strategy: [
      "Use Overlay for specialty discovery and booking acceleration.",
      "Use Assist to reduce booking friction and improve callback conversion.",
      "Define clear emergency guardrail routing.",
    ],
    confidence: {
      intentClarityOpportunity: "High",
      qualificationOpportunity: "High",
      phase1Feasibility: "High",
      integrationComplexity: "Medium",
      complianceSensitivity: "High",
    },
    sourceLabels: baseSources,
  },
  edtech: {
    pageType: "Program discovery and application funnel page",
    friction: [
      "Course fit questions are not captured before contact forms.",
      "Eligibility concerns delay application starts.",
      "Fee and scholarship confusion causes drop-offs.",
    ],
    strategy: [
      "Use Overlay for intent-first course discovery.",
      "Use Assist for eligibility and counsellor callback capture.",
      "Use Page mode for campaign-led brochure and program journeys.",
    ],
    confidence: {
      intentClarityOpportunity: "High",
      qualificationOpportunity: "Medium",
      phase1Feasibility: "High",
      integrationComplexity: "Low",
      complianceSensitivity: "Medium",
    },
    sourceLabels: baseSources,
  },
  banking: {
    pageType: "Banking product onboarding and eligibility page",
    friction: [
      "Users lack guided product selection before KYC prep.",
      "Loan and account intents are mixed in shared funnels.",
      "Status and branch routing journeys are fragmented.",
    ],
    strategy: [
      "Use Overlay for account opening and callback flows.",
      "Use Assist for eligibility checks with safe guardrails.",
      "Use Page mode for product comparison and campaign intents.",
    ],
    confidence: {
      intentClarityOpportunity: "High",
      qualificationOpportunity: "Medium",
      phase1Feasibility: "High",
      integrationComplexity: "High",
      complianceSensitivity: "High",
    },
    sourceLabels: baseSources,
  },
};

export function getMockAnalysis(industryId: IndustryId) {
  return summaries[industryId];
}
