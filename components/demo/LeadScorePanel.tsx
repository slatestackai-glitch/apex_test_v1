import { Gauge, Target } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { ConversationSession } from "@/lib/conversation/types";

export function LeadScorePanel({ session }: { session: ConversationSession }) {
  return (
    <Card className="p-3">
      <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
        <Gauge className="h-4 w-4 text-[var(--apex-blue)]" />
        Lead score
      </p>
      <p className="text-xl font-semibold">{session.leadScore}/100</p>
      <Progress value={session.leadScore} className="mt-2" />
      <p className="mt-2 flex items-center gap-2 text-xs text-[var(--apex-text-secondary)]">
        <Target className="h-3.5 w-3.5" />
        Qualified threshold: 70
      </p>
    </Card>
  );
}
