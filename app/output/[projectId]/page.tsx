"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { AppShell } from "@/components/shell/AppShell";
import { Header } from "@/components/shell/Header";
import { OutputDashboard } from "@/components/output/OutputDashboard";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";
import { ApexProject } from "@/lib/projectSchema";
import { getProjectByIdClient } from "@/lib/clientStorage";

const linkBtn =
  "inline-flex h-10 items-center justify-center rounded-xl border border-[var(--apex-border)] bg-white px-4 text-sm font-medium text-[var(--apex-text-primary)] hover:bg-[var(--apex-section-bg)]";

export default function OutputProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ApexProject | null | undefined>(undefined);

  useEffect(() => {
    if (!projectId) return;

    // Check localStorage first — works across Vercel serverless invocations
    const local = getProjectByIdClient(projectId);
    if (local) {
      setProject(local);
      return;
    }

    // Fall back to API (local dev with writable filesystem)
    fetch(`/api/projects/${projectId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { project: ApexProject } | null) => {
        setProject(data?.project ?? null);
      })
      .catch(() => setProject(null));
  }, [projectId]);

  if (project === undefined) {
    return (
      <AppShell>
        <main>
          <Header title="Loading…" subtitle="" />
        </main>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell>
        <main>
          <Header title="Demo Package Not Found" subtitle="This project ID does not exist." />
          <Card>
            <p className="text-sm text-[var(--apex-text-secondary)]">
              Create a new demo package from the studio flow.
            </p>
            <div className="mt-3">
              <Link href="/studio" className={linkBtn}>
                Create APEX Demo
              </Link>
            </div>
          </Card>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main>
        <Header
          title="Generated Demo Package"
          subtitle={`Project ID: ${project.id} · Created ${formatDateTime(project.createdAt)}`}
          actions={
            <Link href="/studio" className={linkBtn}>
              Create New
            </Link>
          }
        />
        <OutputDashboard project={project} />
      </main>
    </AppShell>
  );
}
