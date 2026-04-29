import { AppShell } from "@/components/shell/AppShell";
import { Header } from "@/components/shell/Header";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { industries } from "@/lib/industries";

export default function GuardrailsPage() {
  return (
    <AppShell>
      <main>
        <Header title="Guardrails" subtitle="Industry-specific limits and fallback behavior for safe conversion journeys." />

        <div className="space-y-3">
          {industries.map((industry) => (
            <Card key={industry.id}>
              <h2 className="text-base font-semibold">{industry.name}</h2>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {industry.guardrails.map((guardrail) => (
                  <div key={guardrail.id} className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
                    <p className="font-medium">{guardrail.label}</p>
                    <p className="text-sm text-[var(--apex-text-secondary)]">{guardrail.description}</p>
                    <p className="mt-1 text-xs text-[var(--apex-text-secondary)]">Fallback: {guardrail.fallbackBehavior}</p>
                    <Badge className="mt-2">{guardrail.severity}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
