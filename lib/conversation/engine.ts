import {
  consentChips,
  initialAssistantMessage,
  initialChips,
  productTypeChips,
  vehicleDetailChips,
  cityChips,
} from "@/lib/conversation/insuranceConversation";
import { ConversationInput, ConversationSession } from "@/lib/conversation/types";

function detectJourney(text: string): { journey: string; response: string } {
  const t = text.toLowerCase();
  if (/renew|renewal|expir|due for|my existing policy/.test(t)) {
    return {
      journey: "Renew Policy",
      response: "I can help you renew your policy. What type of insurance are you renewing — motor, health, or another product?",
    };
  }
  if (/claim|accident|damage|loss|stolen|repair|settlement/.test(t)) {
    return {
      journey: "Track Claim",
      response: "I'll help you track your claim. What type of insurance are we looking at — motor, health, or home?",
    };
  }
  if (/compare|comparison|best plan|which plan|different plan|options/.test(t)) {
    return {
      journey: "Compare Plans",
      response: "Happy to help you compare plans. Which type of insurance are you evaluating?",
    };
  }
  if (/callback|call me|speak to|talk to|advisor|agent|someone call/.test(t)) {
    return {
      journey: "Request Callback",
      response: "Of course! What type of insurance can our advisor help you with?",
    };
  }
  return {
    journey: "Get Quote",
    response: "Great — let's get you a quote. What type of insurance are you looking for?",
  };
}

function timestamp() {
  return new Date().toISOString();
}

function messageId() {
  return `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function createInitialSession(clientName: string, assistantName = "Ava"): ConversationSession {
  return {
    state: "initial",
    messages: [
      {
        id: messageId(),
        role: "assistant",
        text: initialAssistantMessage.replace("Ava", assistantName),
        timestamp: timestamp(),
      },
    ],
    chips: initialChips,
    leadScore: 0,
    capturedFields: {
      client: clientName,
      journey: "",
      productType: "",
      vehicleDetailMethod: "",
      city: "",
      phone: "",
      consent: false,
    },
    qualificationReady: false,
    analyticsEvents: ["apex_opened"],
    handoffReady: false,
    crmPushed: false,
    payloadPreview: {
      event: "qualified_quote_lead",
      client: clientName,
      journey: "Get Quote",
      productType: "",
      city: "",
      leadScore: 0,
      handoff: ["Engati CRM", "WhatsApp Business"],
      consent: false,
    },
  };
}

function appendAssistant(session: ConversationSession, text: string) {
  session.messages.push({ id: messageId(), role: "assistant", text, timestamp: timestamp() });
}

function appendUser(session: ConversationSession, text: string) {
  session.messages.push({ id: messageId(), role: "user", text, timestamp: timestamp() });
}

function cloneSession(session: ConversationSession): ConversationSession {
  return {
    ...session,
    messages: [...session.messages],
    chips: [...session.chips],
    capturedFields: { ...session.capturedFields },
    analyticsEvents: [...session.analyticsEvents],
    payloadPreview: { ...session.payloadPreview },
  };
}

export function applyConversationInput(session: ConversationSession, input: ConversationInput): ConversationSession {
  const next = cloneSession(session);
  const text = input.text.trim();

  if (!text) {
    return next;
  }

  appendUser(next, text);

  switch (next.state) {
    case "initial": {
      const detected = detectJourney(text);
      next.state = "journey_selected";
      next.analyticsEvents.push("journey_selected", "journey_started", "intent_detected");
      next.leadScore += 20;
      next.capturedFields.journey = detected.journey;
      next.payloadPreview.journey = detected.journey;
      appendAssistant(next, detected.response);
      next.chips = productTypeChips;
      break;
    }
    case "journey_selected": {
      next.state = "product_type_selected";
      next.analyticsEvents.push("question_answered", "field_captured", "lead_score_updated");
      const normalized = text.toLowerCase();
      const productType = productTypeChips.find((chip) => chip.toLowerCase() === normalized) ?? text;
      next.capturedFields.productType = productType;
      next.payloadPreview.productType = productType;
      next.leadScore += 20;
      appendAssistant(
        next,
        "For motor insurance, do you have the vehicle registration number, or would you prefer to share the make, model, and year?"
      );
      next.chips = vehicleDetailChips;
      break;
    }
    case "product_type_selected": {
      next.state = "vehicle_detail_method_selected";
      next.analyticsEvents.push("question_answered", "field_captured", "lead_score_updated");
      next.capturedFields.vehicleDetailMethod = text;
      next.leadScore += 20;
      appendAssistant(next, "Which city are you currently in for this quote journey?");
      next.chips = cityChips;
      break;
    }
    case "vehicle_detail_method_selected": {
      next.state = "city_captured";
      next.analyticsEvents.push("question_answered", "field_captured", "lead_score_updated");
      next.capturedFields.city = text;
      next.payloadPreview.city = text;
      next.leadScore += 10;
      appendAssistant(next, "Please share your phone number so we can continue your quote with an advisor if needed.");
      next.chips = ["+91 9876543210", "+91 9123456789"];
      break;
    }
    case "city_captured": {
      next.state = "phone_captured";
      next.analyticsEvents.push("question_answered", "field_captured", "lead_score_updated");
      next.capturedFields.phone = text;
      next.leadScore += 20;
      appendAssistant(next, "Can we use this information to continue in CRM and WhatsApp for quote follow-up?");
      next.chips = consentChips;
      break;
    }
    case "phone_captured": {
      const consent = text.toLowerCase().includes("yes");
      next.state = "consent_captured";
      next.capturedFields.consent = consent;
      next.payloadPreview.consent = consent;
      next.analyticsEvents.push("question_answered", "consent_captured", "lead_score_updated");

      if (consent) {
        next.leadScore += 10;
      }

      if (next.leadScore >= 70 && consent) {
        next.state = "lead_qualified";
        next.qualificationReady = true;
        next.analyticsEvents.push("qualification_threshold_reached", "lead_qualified");
        appendAssistant(next, "Qualified Quote Lead Created. I’m preparing CRM and WhatsApp handoff now.");
        next.chips = ["Simulate CRM push", "Review payload"];
      } else {
        appendAssistant(next, "Consent is required for CRM and WhatsApp handoff. I can keep this as a partial lead.");
        next.chips = ["Yes, continue", "Schedule advisor callback"];
      }
      break;
    }
    case "consent_captured": {
      const reConsent = text.toLowerCase().includes("yes") || text.toLowerCase().includes("continue");
      if (reConsent) {
        next.state = "lead_qualified";
        next.capturedFields.consent = true;
        next.payloadPreview.consent = true;
        next.qualificationReady = true;
        next.leadScore = Math.max(next.leadScore, 80);
        next.analyticsEvents.push("consent_captured", "qualification_threshold_reached", "lead_qualified");
        appendAssistant(next, "Qualified Quote Lead Created. I'm preparing CRM and WhatsApp handoff now.");
        next.chips = ["Simulate CRM push", "Review payload"];
      } else {
        appendAssistant(next, "No problem. I'll log this as a partial lead. An advisor can follow up if you'd like.");
        next.chips = ["Request advisor callback", "Restart journey"];
      }
      break;
    }
    case "lead_qualified": {
      next.state = "crm_push_simulated";
      next.crmPushed = true;
      next.analyticsEvents.push("crm_push_attempted", "crm_push_simulated");
      appendAssistant(next, "Engati CRM push simulated successfully. WhatsApp handoff can now be initiated.");
      next.chips = ["Prepare WhatsApp handoff", "Schedule advisor callback"];
      break;
    }
    case "crm_push_simulated": {
      next.state = "whatsapp_handoff_ready";
      next.handoffReady = true;
      next.analyticsEvents.push("whatsapp_handoff_started", "handoff_completed");
      appendAssistant(
        next,
        "WhatsApp handoff is ready. Lead score is 90/100, required fields are captured, and advisor callback is available as the next step."
      );
      next.chips = ["Qualified lead summary", "Restart journey"];
      next.payloadPreview = {
        ...next.payloadPreview,
        event: "qualified_quote_lead",
        leadScore: Math.max(90, next.leadScore),
        handoff: ["Engati CRM", "WhatsApp Business"],
      };
      next.leadScore = Math.max(90, next.leadScore);
      break;
    }
    case "whatsapp_handoff_ready": {
      if (text.toLowerCase().includes("restart")) {
        return createInitialSession(String(next.capturedFields.client || "Client"));
      }

      appendAssistant(next, "Lead is already qualified and handoff-ready. You can switch modes to show the same result.");
      next.chips = ["Restart journey", "Keep current state"];
      break;
    }
    default:
      break;
  }

  next.payloadPreview = {
    ...next.payloadPreview,
    leadScore: next.leadScore,
  };

  return next;
}

export function runConversationToFinal(clientName: string, assistantName = "Ava") {
  const steps = [
    "Get quote",
    "Motor insurance",
    "I have the registration number",
    "Mumbai",
    "+91 9876543210",
    "Yes, continue",
    "Simulate CRM push",
    "Prepare WhatsApp handoff",
  ];

  let session = createInitialSession(clientName, assistantName);
  for (const step of steps) {
    session = applyConversationInput(session, { text: step });
  }

  return session;
}
