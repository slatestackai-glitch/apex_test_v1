import type { ApexProject } from "@/lib/projectSchema";

const KEY = "apex-projects";

function readAll(): ApexProject[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ApexProject[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(projects: ApexProject[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(projects));
  } catch {}
}

export function saveProjectClient(project: ApexProject) {
  const existing = readAll().filter((p) => p.id !== project.id);
  existing.unshift(project);
  writeAll(existing);
}

export function listProjectsClient(): ApexProject[] {
  return readAll().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function getProjectByIdClient(id: string): ApexProject | null {
  return readAll().find((p) => p.id === id) ?? null;
}
