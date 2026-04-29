import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { ApexProject, ProjectListItem } from "@/lib/projectSchema";

const dataDir = path.join(process.cwd(), ".apex-data");
const dataFile = path.join(dataDir, "projects.json");

interface ProjectFile {
  projects: ApexProject[];
}

async function ensureDataFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(dataFile, "utf8");
  } catch {
    await writeFile(dataFile, JSON.stringify({ projects: [] }, null, 2), "utf8");
  }
}

async function readProjectFile(): Promise<ProjectFile> {
  await ensureDataFile();

  try {
    const content = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(content) as ProjectFile;

    if (!parsed || !Array.isArray(parsed.projects)) {
      throw new Error("Malformed project file");
    }

    return parsed;
  } catch {
    const recovered: ProjectFile = { projects: [] };
    await writeFile(dataFile, JSON.stringify(recovered, null, 2), "utf8");
    return recovered;
  }
}

async function writeProjectFile(projects: ApexProject[]) {
  await ensureDataFile();
  await writeFile(dataFile, JSON.stringify({ projects }, null, 2), "utf8");
}

export async function listProjects(): Promise<ApexProject[]> {
  const file = await readProjectFile();
  return [...file.projects].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function listProjectSummaries(): Promise<ProjectListItem[]> {
  const projects = await listProjects();
  return projects.map((project) => ({
    id: project.id,
    createdAt: project.createdAt,
    client: project.client,
    industry: project.industry,
    goal: project.goal,
    selectedPrimaryMode: project.selectedPrimaryMode,
    phaseSummary: project.phaseSummary,
  }));
}

export async function getProjectById(projectId: string): Promise<ApexProject | null> {
  const projects = await listProjects();
  return projects.find((project) => project.id === projectId) ?? null;
}

export async function saveProject(project: ApexProject): Promise<ApexProject> {
  const projects = await listProjects();
  const deduped = projects.filter((item) => item.id !== project.id);
  deduped.unshift(project);
  await writeProjectFile(deduped);
  return project;
}

export async function duplicateProject(projectId: string): Promise<ApexProject | null> {
  const project = await getProjectById(projectId);

  if (!project) {
    return null;
  }

  const copy: ApexProject = {
    ...project,
    id: `apx-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    client: `${project.client} (Copy)`,
  };

  await saveProject(copy);
  return copy;
}
