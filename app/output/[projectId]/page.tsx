import Link from "next/link";

import { AppShell } from "@/components/shell/AppShell";
import { Header } from "@/components/shell/Header";
import { OutputDashboard } from "@/components/output/OutputDashboard";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";
import { getProjectById } from "@/lib/storage";

const linkBtn =
  "inline-flex h-10 items-center justify-center rounded-xl border border-[var(--apex-border)] bg-white px-4 text-sm font-medium text-[var(--apex-text-primary)] hover:bg-[var(--apex-section-bg)]";

export default async function OutputProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return (
      <AppShell>
        <main>
          <Header title="Demo Package Not Found" subtitle="This project ID does not exist in local storage." />
          <Card>
            <p className="text-sm text-[var(--apex-text-secondary)]">Create a new demo package from the studio flow.</p>
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
          subtitle={`Project ID: ${project.id} • Created ${formatDateTime(project.createdAt)}`}
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
