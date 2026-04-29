import { ConversationProvider, ProviderRequest } from "@/lib/llm/types";

export const mockProvider: ConversationProvider = {
  id: "mock-rule-provider",
  async generate(request: ProviderRequest) {
    const lastUserMessage = [...request.messages].reverse().find((message) => message.role === "user");

    return {
      content:
        lastUserMessage?.content
          ? `Simulated response: ${lastUserMessage.content}. Next step is progressive qualification and consent capture.`
          : "Simulated response: Ask one contextual question and capture only required fields.",
      provider: "mock-rule-provider",
      simulated: true,
    };
  },
};
