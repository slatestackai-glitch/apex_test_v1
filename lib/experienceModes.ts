import { ExperienceMode } from "@/lib/projectSchema";

export const experienceModes: ExperienceMode[] = [
  {
    id: "overlay",
    name: "APEX Overlay",
    description:
      "A centered guided conversion modal layered over the native website, designed for high-intent journeys.",
    bestFor: "Quote, renewal, and callback journeys where intent needs structured progression.",
    implementationNotes:
      "Opens as 80% viewport modal with blurred backdrop and three-column operational layout.",
    demoStrength: "High",
    engineeringEffort: "Medium",
    conversionValue: "High",
    productionDependency: "CRM mapping, consent handling, overlay trigger placement",
    recommendedUseCase: "Primary mode for enterprise quote and lead qualification flows.",
  },
  {
    id: "assist",
    name: "APEX Assist",
    description:
      "An embedded native-page assistance layer that demonstrates before/after friction reduction against traditional forms.",
    bestFor: "Comparative demos and incremental rollout over existing pages.",
    implementationNotes:
      "Supports reversible native vs assisted toggle with shared conversation engine.",
    demoStrength: "High",
    engineeringEffort: "Low",
    conversionValue: "Medium",
    productionDependency: "Front-end embedding and analytics instrumentation",
    recommendedUseCase: "Show immediate value without replacing current page templates.",
  },
  {
    id: "page",
    name: "APEX Page",
    description:
      "A generated AI-first landing experience for campaigns and dedicated conversion paths.",
    bestFor: "Campaign traffic, microsites, and product-specific lead funnels.",
    implementationNotes:
      "Generated branded page with journeys, assistant workspace, and qualification insights.",
    demoStrength: "Medium",
    engineeringEffort: "Medium",
    conversionValue: "High",
    productionDependency: "Page hosting, content governance, SEO/URL strategy",
    recommendedUseCase: "Run high-intent campaigns with guided conversion experiences.",
  },
];
