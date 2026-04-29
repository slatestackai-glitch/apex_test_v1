import type { V3Project } from "./types";
import { defaultProject, defaultModeConfig } from "./types";

const KEY = "apex-v3-project";

export function saveV3Project(project: V3Project) {
  try {
    localStorage.setItem(KEY, JSON.stringify(project));
  } catch {}
}

export function loadV3Project(): V3Project {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const parsed = JSON.parse(raw) as Partial<V3Project>;
    return {
      ...defaultProject,
      modeConfig: defaultModeConfig,
      ...parsed,
      id: parsed.id ?? genId(),
    } as V3Project;
  } catch {
    return fresh();
  }
}

export function loadV3ProjectById(id: string): V3Project | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as V3Project;
    return parsed.id === id ? parsed : null;
  } catch {
    return null;
  }
}

export function clearV3Project() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

function fresh(): V3Project {
  return { ...defaultProject, id: genId(), modeConfig: defaultModeConfig };
}

function genId() {
  return `proj-${Date.now().toString(36)}`;
}
