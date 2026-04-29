import { CircleCheckBig, CircleX, SendHorizonal } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { ConversationSession } from "@/lib/conversation/types";

export function HandoffReadinessPanel({ session }: { session: ConversationSession }) {
  const ready = session.handoffReady;
  const fields = session.capturedFields;
  const requiredFieldsCaptured = Boolean(
    fields.productType && fields.city && fields.phone && fields.vehicleDetailMethod && fields.consent
  );

  return (
    <Card className="p-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <SendHorizonal className="h-4 w-4 text-[var(--apex-blue)]" />
        Handoff readiness
      </p>

      <div className={`rounded-xl border px-3 py-2 text-xs ${ready ? "border-[#c8efda] bg-[#f3fbf7]" : "border-[#f2dfb2] bg-[#fff9eb]"}`}>
        <p className="flex items-center gap-1 font-medium">
          {ready ? <CircleCheckBig className="h-3.5 w-3.5 text-[var(--apex-success)]" /> : <CircleX className="h-3.5 w-3.5 text-[var(--apex-warning)]" />}
          {ready ? "Qualified Quote Lead Created" : "In progress"}
        </p>
        <ul className="mt-1 space-y-1 text-[var(--apex-text-secondary)]">
          <li>Required fields captured: {requiredFieldsCaptured ? "yes" : "pending"}</li>
          <li>Consent captured: {Boolean(fields.consent) ? "yes" : "pending"}</li>
          <li>CRM event: qualified_quote_lead</li>
          <li>Engati CRM push: {session.crmPushed ? "simulated success" : "pending"}</li>
          <li>WhatsApp handoff: {session.handoffReady ? "ready" : "pending"}</li>
          <li>Advisor callback: optional next step</li>
        </ul>
      </div>
    </Card>
  );
}
