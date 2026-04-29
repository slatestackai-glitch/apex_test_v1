import type { Node, Edge } from "reactflow";
import { MarkerType } from "reactflow";
import type { V3Project } from "./types";

const COL = [0, 360, 740, 1140, 1520, 1900] as const;
const MID = 300;
const EDGE_OPTS = {
  type: "smoothstep" as const,
  markerEnd: { type: MarkerType.ArrowClosed, color: "#C8102E" },
  style: { stroke: "#C8102E", strokeWidth: 1.5 },
};

function node(
  id: string,
  label: string,
  x: number,
  y: number,
  opts: { accent?: boolean; dim?: boolean; width?: number } = {}
): Node {
  const isAccent = opts.accent ?? false;
  const isDim = opts.dim ?? false;
  const width = opts.width ?? 190;
  return {
    id,
    position: { x, y },
    data: { label },
    style: {
      width,
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 12,
      fontWeight: isAccent ? 700 : 500,
      background: isAccent ? "#C8102E" : "#fff",
      color: isAccent ? "#fff" : isDim ? "#9CA3AF" : "#0A2540",
      border: isAccent ? "none" : `1.5px solid ${isDim ? "#E5E7EB" : "#0A2540"}`,
      boxShadow: isAccent
        ? "0 4px 12px rgba(200,16,46,0.25)"
        : "0 2px 8px rgba(10,37,64,0.08)",
    },
  };
}

function edge(id: string, source: string, target: string): Edge {
  return { id, source, target, ...EDGE_OPTS };
}

export function buildV3MindMap(project: V3Project): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const selectedJourneys = project.journeys.filter((j) => j.selected);
  const clientLabel = project.clientName || "Client";
  const goal = project.businessGoal || "Qualified lead";

  // Col 0: Lead Definition
  nodes.push(node("lead", `Lead: ${goal}`, COL[0], MID, { width: 200 }));

  // Col 1: Website Entry
  nodes.push(node("website", `${clientLabel} Website`, COL[1], MID, { width: 180 }));
  edges.push(edge("e-lead-web", "lead", "website"));

  // Col 1b: User intents (above/below)
  const intentCount = selectedJourneys.length || 3;
  const spacing = 120;
  const startY = MID - ((intentCount - 1) * spacing) / 2;

  const journeyLabels =
    selectedJourneys.length > 0
      ? selectedJourneys.map((j) => j.name)
      : ["Buy Insurance", "Renew Policy", "Get a Quote"];

  journeyLabels.forEach((label, i) => {
    const id = `intent-${i}`;
    nodes.push(node(id, label, COL[2], startY + i * spacing, { width: 175 }));
    edges.push(edge(`e-web-${id}`, "website", id));
  });

  // Col 3: APEX AI (center accent)
  nodes.push(node("apex", "APEX AI Conversation", COL[3], MID, { accent: true, width: 200 }));
  journeyLabels.forEach((_, i) => {
    edges.push(edge(`e-intent-${i}-apex`, `intent-${i}`, "apex"));
  });

  // Col 4: Qualification
  nodes.push(node("qualify", "Qualification", COL[4], MID - 80, { width: 170 }));
  nodes.push(node("noqualify", "Nurture / Exit", COL[4], MID + 80, { dim: true, width: 170 }));
  edges.push(edge("e-apex-qualify", "apex", "qualify"));
  edges.push(edge("e-apex-noqualify", "apex", "noqualify"));

  // Col 5: Handoff
  nodes.push(node("handoff", "Agent Handoff / CRM", COL[5], MID - 80, { width: 185 }));
  edges.push(edge("e-qualify-handoff", "qualify", "handoff"));

  return { nodes, edges };
}
