import { Braces } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { ConversationSession } from "@/lib/conversation/types";

export function PayloadPreview({ session }: { session: ConversationSession }) {
  return (
    <Card className="p-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Braces className="h-4 w-4 text-[var(--apex-blue)]" />
        Payload preview
      </p>
      <pre className="max-h-[190px] overflow-auto rounded-xl bg-[#0a2540] p-2 text-xs text-white">
{JSON.stringify(session.payloadPreview, null, 2)}
      </pre>
    </Card>
  );
}
