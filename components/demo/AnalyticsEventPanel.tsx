import { Activity } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { ConversationSession } from "@/lib/conversation/types";

export function AnalyticsEventPanel({ session }: { session: ConversationSession }) {
  return (
    <Card className="p-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Activity className="h-4 w-4 text-[var(--apex-blue)]" />
        Analytics events
      </p>
      <ul className="max-h-[150px] space-y-1 overflow-y-auto text-xs text-[var(--apex-text-secondary)]">
        {session.analyticsEvents.map((event, index) => (
          <li key={`${event}-${index}`} className="rounded-md border border-[var(--apex-border)] bg-white px-2 py-1">
            {event}
          </li>
        ))}
      </ul>
    </Card>
  );
}
