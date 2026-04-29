import Link from "next/link";

import { DemoExperience } from "@/components/demo/DemoExperience";
import { AppShell } from "@/components/shell/AppShell";
import { Header } from "@/components/shell/Header";
import { Card } from "@/components/ui/Card";
import { createDefaultStudioInput, generateApexProject } from "@/lib/projectGenerator";
import { getProjectById } from "@/lib/storage";

const linkBtn =
  "inline-flex h-10 items-center justify-center rounded-xl border border-[var(--apex-border)] bg-white px-4 text-sm font-medium text-[var(--apex-text-primary)] hover:bg-[var(--apex-section-bg)]";

export default async function DemoProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  let project = await getProjectById(projectId);

  if (!project && projectId === "sample-insurance") {
    const sampleInput = createDefaultStudioInput("insurance");
    project = generateApexProject(sampleInput);
  }

  if (!project) {
    return (
      <AppShell>
        <main>
          <Header title="Demo Not Found" subtitle="This demo ID was not found in local project storage." />
          <Card>
            <p className="text-sm text-[var(--apex-text-secondary)]">Generate a package first from the studio flow.</p>
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
