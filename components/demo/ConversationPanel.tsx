"use client";

import { FormEvent, useState } from "react";

import { MessageSquareDashed, Send } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ConversationSession } from "@/lib/conversation/types";
import { cn } from "@/lib/utils";

export function ConversationPanel({
  session,
  onSend,
  title,
}: {
  session: ConversationSession;
  onSend: (text: string) => void;
  title?: string;
}) {
  const [text, setText] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <Card className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2">
        <MessageSquareDashed className="h-4 w-4 text-[var(--apex-blue)]" />
        <h3 className="text-sm font-semibold">{title ?? "Ava assistant conversation"}</h3>
      </div>

      <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
        {session.messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[92%] rounded-xl px-3 py-2 text-sm",
              message.role === "assistant"
                ? "bg-[var(--apex-section-bg)] text-[var(--apex-text-primary)]"
                : "ml-auto bg-[#e8f1ff] text-[var(--apex-blue)]"
            )}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {session.chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onSend(chip)}
            className="rounded-full border border-[var(--apex-border)] bg-white px-3 py-1 text-xs hover:bg-[var(--apex-section-bg)]"
          >
            {chip}
          </button>
        ))}
      </div>

      <form className="mt-3 flex gap-2" onSubmit={submit}>
        <Input value={text} onChange={(event) => setText(event.target.value)} placeholder="Type response" />
        <Button type="submit" size="sm">
          <Send className="h-4 w-4" />
          Send
        </Button>
      </form>
    </Card>
  );
}
