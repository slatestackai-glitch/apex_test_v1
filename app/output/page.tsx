import Link from "next/link";

import { AppShell } from "@/components/shell/AppShell";
import { Header } from "@/components/shell/Header";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";
import { listProjectSummaries } from "@/lib/storage";

export default async function OutputListPage() {
  const projects = await listProjectSummaries();

  return (
    <AppShell>
      <main>
        <Header
          title="Recent Demo Packages"
          subtitle="Review generated packages and open any project dashboard or interactive demo."
        />

        <Card>
          {projects.length === 0 ? (
            <p className="text-sm text-[var(--apex-text-secondary)]">No projects found yet. Create your first demo package in Studio.</p>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/output/${project.id}`}
                  className="block rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{project.client}</p>
                    <Badge>{project.industry}</Badge>
                    <Badge variant="info">Primary mode: {project.selectedPrimaryMode}</Badge>
                    <span className="ml-auto text-xs text-[var(--apex-text-secondary)]">{formatDateTime(project.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--apex-text-secondary)]">{project.goal}</p>
                  <p className="mt-1 text-xs text-[var(--apex-text-secondary)]">
                    Phase 1: {project.phaseSummary.phase1} • Phase 2: {project.phaseSummary.phase2}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </main>
    </AppShell>
  );
}
