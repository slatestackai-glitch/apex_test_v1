import { ShieldCheck } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { ConversationSession } from "@/lib/conversation/types";

function maskPhone(value: string) {
  if (!value) return "Not captured";
  const normalized = value.replace(/\s+/g, "");
  if (normalized.length < 4) return "***";
  return `${normalized.slice(0, 3)}******${normalized.slice(-2)}`;
}

export function CapturedFieldsPanel({ session }: { session: ConversationSession }) {
  const fields = session.capturedFields;

  return (
    <Card className="p-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <ShieldCheck className="h-4 w-4 text-[var(--apex-blue)]" />
        Captured fields
      </p>
      <ul className="space-y-1 text-xs text-[var(--apex-text-secondary)]">
        <li><span className="font-medium">Journey:</span> {String(fields.journey || "Not captured")}</li>
        <li><span className="font-medium">Product type:</span> {String(fields.productType || "Not captured")}</li>
        <li><span className="font-medium">Vehicle detail:</span> {String(fields.vehicleDetailMethod || "Not captured")}</li>
        <li><span className="font-medium">City:</span> {String(fields.city || "Not captured")}</li>
        <li><span className="font-medium">Phone:</span> {maskPhone(String(fields.phone || ""))}</li>
        <li><span className="font-medium">Consent:</span> {Boolean(fields.consent) ? "Captured" : "Not captured"}</li>
      </ul>
    </Card>
  );
}
