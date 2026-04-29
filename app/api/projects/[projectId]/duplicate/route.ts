import { NextResponse } from "next/server";

import { duplicateProject } from "@/lib/storage";

export async function POST(_: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const duplicated = await duplicateProject(projectId);

  if (!duplicated) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ projectId: duplicated.id, project: duplicated }, { status: 201 });
}
