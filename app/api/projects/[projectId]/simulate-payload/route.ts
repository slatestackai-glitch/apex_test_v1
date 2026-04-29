import { NextResponse } from "next/server";

import { getProjectById } from "@/lib/storage";

export async function POST(_: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const payload = {
    projectId,
    client: project.client,
    journey: project.selectedJourneys[0]?.name ?? "Get Quote",
    event: project.selectedJourneys[0]?.crmEvent ?? "lead_qualified",
    leadScore: 90,
    consent: true,
    destination: ["Engati CRM", "WhatsApp Business"],
    status: "simulated_success",
  };

  return NextResponse.json({
    status: "payload prepared",
    validation: "passed",
    simulatedPush: "successful",
    fallback: "available",
    payload,
  });
}
