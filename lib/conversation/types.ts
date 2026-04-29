export type ConversationState =
  | "initial"
  | "journey_selected"
  | "product_type_selected"
  | "vehicle_detail_method_selected"
  | "city_captured"
  | "phone_captured"
  | "consent_captured"
  | "lead_qualified"
  | "crm_push_simulated"
  | "whatsapp_handoff_ready";

export interface ConversationMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: string;
}

export interface ConversationSession {
  state: ConversationState;
  messages: ConversationMessage[];
  chips: string[];
  leadScore: number;
  capturedFields: Record<string, string | boolean>;
  qualificationReady: boolean;
  analyticsEvents: string[];
  handoffReady: boolean;
  crmPushed: boolean;
  payloadPreview: Record<string, unknown>;
}

export interface ConversationInput {
  text: string;
}
