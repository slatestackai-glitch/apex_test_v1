import { bankingIndustryPack } from "@/lib/bankingPack";
import { edtechIndustryPack } from "@/lib/edtechPack";
import { healthcareIndustryPack } from "@/lib/healthcarePack";
import { insuranceIndustryPack } from "@/lib/insurancePack";
import { Industry, IndustryId } from "@/lib/projectSchema";

export const industries: Industry[] = [
  insuranceIndustryPack,
  healthcareIndustryPack,
  edtechIndustryPack,
  bankingIndustryPack,
];

export const industryById: Record<IndustryId, Industry> = {
  insurance: insuranceIndustryPack,
  healthcare: healthcareIndustryPack,
  edtech: edtechIndustryPack,
  banking: bankingIndustryPack,
};

export const businessGoalOptions = [
  "Increase qualified leads",
  "Improve quote completion",
  "Improve appointment booking",
  "Improve product discovery",
  "Improve callback capture",
  "Improve self-service resolution",
  "Improve WhatsApp continuation",
  "Improve branch/location routing",
  "Improve application start rate",
  "Reduce drop-offs before contact capture",
];

export const primaryConversionActions = [
  "Generate quote",
  "Renew policy",
  "Book appointment",
  "Request callback",
  "Start WhatsApp conversation",
  "Submit qualified lead",
  "Compare plans",
  "Track status",
  "Download brochure",
  "Start application",
  "Route to nearest branch",
];

export const knowledgeSourceOptions = [
  "Website content",
  "FAQs",
  "Product brochures",
  "Pricing sheets",
  "Policy/service documents",
  "Branch/location data",
  "Eligibility rules",
  "Historical chats",
  "CRM records",
  "Uploaded knowledge base",
];

export const actionOptions = [
  "Capture lead",
  "Push lead to CRM",
  "Start WhatsApp journey",
  "Schedule callback",
  "Generate quote request",
  "Book appointment",
  "Track claim/application status",
  "Send document request",
  "Route to branch/location",
  "Trigger webhook",
  "Create support ticket",
  "Notify sales team",
];
