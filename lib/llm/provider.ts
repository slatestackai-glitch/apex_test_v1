import { mockProvider } from "@/lib/llm/mockProvider";
import { ConversationProvider } from "@/lib/llm/types";

export function getConversationProvider(): ConversationProvider {
  return mockProvider;
}
