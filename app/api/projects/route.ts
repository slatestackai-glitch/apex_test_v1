import { NextResponse } from "next/server";

import { createDefaultStudioInput, generateApexProject } from "@/lib/projectGenerator";
import { studioInputSchema, StudioInput } from "@/lib/projectSchema";
import { listProjectSummaries, saveProject } from "@/lib/storage";

export async function GET() {
  const projects = await listProjectSummaries();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    // Parse base fields via schema (passthrough), then merge with defaults for new fields
    const parsed = studioInputSchema.passthrough().parse(body) as unknown as StudioInput;
    const defaults = createDefaultStudioInput(parsed.industry);
    const merged: StudioInput = {
      ...defaults,
      ...parsed,
      leadDefinition: parsed.leadDefinition ?? defaults.leadDefinition,
      overlayConfig: parsed.overlayConfig ?? defaults.overlayConfig,
      assistConfig: parsed.assistConfig ?? defaults.assistConfig,
      pageConfig: parsed.pageConfig ?? defaults.pageConfig,
      editableGuardrails: parsed.editableGuardrails ?? defaults.editableGuardrails,
      handoffChannels: parsed.handoffChannels ?? defaults.handoffChannels,
      knowledgeFiles: parsed.knowledgeFiles ?? defaults.knowledgeFiles,
      customJourneys: parsed.customJourneys ?? defaults.customJourneys,
      behaviorPrompt: parsed.behaviorPrompt ?? defaults.behaviorPrompt,
      detectedIntent: parsed.detectedIntent ?? defaults.detectedIntent,
      missingInputs: parsed.missingInputs ?? defaults.missingInputs,
      confirmedSetupCard: parsed.confirmedSetupCard ?? defaults.confirmedSetupCard,
      vertical: parsed.vertical ?? defaults.vertical,
    };
    const project = generateApexProject(merged);
    const saved = await saveProject(project);

    return NextResponse.json({ projectId: saved.id, project: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to create project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
