import { AppShell } from "@/components/shell/AppShell";
import { Header } from "@/components/shell/Header";
import { Card } from "@/components/ui/Card";
import { getAnalyticsForIndustry } from "@/lib/analytics";

const groups = ["Discovery", "Journey", "Qualification", "Handoff", "Fallback"] as const;

export default function AnalyticsEventsPage() {
  const events = getAnalyticsForIndustry("insurance");

  return (
    <AppShell>
      <main>
        <Header title="Analytics Events" subtitle="APEX conversion funnel instrumentation reference." />

        <Card>
          {groups.map((group) => (
            <div key={group} className="mb-4 last:mb-0">
              <h2 className="text-base font-semibold">{group}</h2>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {events
                  .filter((event) => event.group === group)
                  .map((event) => (
                    <div key={event.id} className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-[var(--apex-text-secondary)]">{event.trigger}</p>
                      <p className="mt-1 text-xs text-[var(--apex-text-secondary)]">Owner: {event.owner} • Priority: {event.priority}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </Card>
      </main>
    </AppShell>
  );
}
