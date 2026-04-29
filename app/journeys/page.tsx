import { AppShell } from "@/components/shell/AppShell";
import { Header } from "@/components/shell/Header";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { industries } from "@/lib/industries";

export default function JourneyLibraryPage() {
  return (
    <AppShell>
      <main>
        <Header title="Journey Library" subtitle="Industry journey templates used by APEX Studio recommendations." />

        <div className="space-y-3">
          {industries.map((industry) => (
            <Card key={industry.id}>
              <h2 className="text-base font-semibold">{industry.name}</h2>
              <p className="text-sm text-[var(--apex-text-secondary)]">{industry.description}</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {industry.journeys.map((journey) => (
                  <div key={journey.id} className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
                    <p className="font-medium">{journey.name}</p>
                    <p className="text-sm text-[var(--apex-text-secondary)]">{journey.intent}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <Badge>{journey.phase}</Badge>
                      <Badge variant="info">{journey.suggestedMode}</Badge>
                      <Badge>{journey.complexity}</Badge>
                    </div>
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
