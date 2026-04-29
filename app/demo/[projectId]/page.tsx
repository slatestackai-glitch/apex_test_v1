"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { DemoExperience } from "@/components/demo/DemoExperience";
import { AppShell } from "@/components/shell/AppShell";
import { Header } from "@/components/shell/Header";
import { Card } from "@/components/ui/Card";
import { ApexProject } from "@/lib/projectSchema";
import { getProjectByIdClient } from "@/lib/clientStorage";

const linkBtn =
  "inline-flex h-10 items-center justify-center rounded-xl border border-[var(--apex-border)] bg-white px-4 text-sm font-medium text-[var(--apex-text-primary)] hover:bg-[var(--apex-section-bg)]";

export default function DemoProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ApexProject | null | undefined>(undefined);

  useEffect(() => {
    if (!projectId) return;

    // Check localStorage first (works on Vercel)
    const local = getProjectByIdClient(projectId);
    if (local) {
      setProject(local);
      return;
    }

    // Fall back to API for local dev / sample
    fetch(`/api/projects/${projectId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { project: ApexProject } | null) => {
        setProject(data?.project ?? null);
      })
      .catch(() => setProject(null));
  }, [projectId]);

  if (project === undefined) return null;

  if (!project) {
    return (
      <AppShell>
        <main>
          <Header title="Demo Not Found" subtitle="This demo ID was not found in project storage." />
          <Card>
            <p className="text-sm text-[var(--apex-text-secondary)]">
              Generate a package first from the studio flow.
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

  return <DemoExperience project={project} />;
}
