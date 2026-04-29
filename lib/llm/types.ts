export interface ProviderMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ProviderRequest {
  messages: ProviderMessage[];
  context?: Record<string, unknown>;
}

export interface ProviderResponse {
  content: string;
  provider: string;
  simulated: boolean;
}

export interface ConversationProvider {
  id: string;
  generate(request: ProviderRequest): Promise<ProviderResponse>;
}
