import { AnalyticsEvent, JourneyTemplate, MindMapEdge, MindMapNode, ProductionReadinessItem } from "@/lib/projectSchema";

function createNode(
  id: string,
  label: string,
  group: MindMapNode["group"],
  details: readonly string[],
  x: number,
  y: number,
  phase?: "Phase 1" | "Phase 2"
): MindMapNode {
  return { id, label, group, details: [...details], x, y, phase };
}

export function buildMindMap(params: {
  client: string;
  journeys: Array<JourneyTemplate & { phase: "Phase 1" | "Phase 2" }>;
  modes: string[];
  knowledgeSources: string[];
  actions: string[];
  guardrails: string[];
  analyticsEvents: AnalyticsEvent[];
  productionReadiness: ProductionReadinessItem[];
}) {
  const { client, journeys, modes, knowledgeSources, actions, guardrails, analyticsEvents, productionReadiness } = params;

  const nodes: MindMapNode[] = [];
  const edges: MindMapEdge[] = [];

  // Left-to-right layout: Entry → Intent → Center → Journeys → Qualification → Handoff
  // x increases left-to-right; main flow at y=300, supporting nodes above/below
  const COL = [0, 400, 800, 1280, 1760, 2240, 2720] as const;
  const MID = 300;

  nodes.push(createNode("center", "APEX Conversion Journey", "center", [client, "Turn website intent into qualified leads"], COL[2], MID));

  // Left inputs (col 0)
  nodes.push(createNode("entry", "Entry Points", "entry", ["Website hero CTA", "Quote page", "Callback CTA"], COL[0], MID - 160));
  nodes.push(createNode("knowledge", "Knowledge Sources", "knowledge", knowledgeSources.slice(0, 5), COL[0], MID + 160));

  // User intents (col 1)
  nodes.push(createNode("intent", "User Intents", "intent", journeys.map((j) => j.intent).slice(0, 4), COL[1], MID));

  edges.push({ id: "edge-center-entry", source: "entry", target: "center" });
  edges.push({ id: "edge-center-knowledge", source: "knowledge", target: "center" });
  edges.push({ id: "edge-center-intent", source: "intent", target: "center" });

  // Journey hub (col 3) + individual journey nodes fanning vertically
  nodes.push(createNode("journey", "Selected Journeys", "journey", journeys.map((j) => `${j.name} (${j.phase})`), COL[3], MID));
  edges.push({ id: "edge-center-journey", source: "center", target: "journey" });

  const journeySpacing = 180;
  const journeyStartY = MID - ((journeys.length - 1) * journeySpacing) / 2;
  journeys.forEach((journey, index) => {
    const nodeId = `journey-${journey.id}`;
    nodes.push(
      createNode(
        nodeId,
        journey.name,
        "journey",
        [
          journey.businessValue,
          `CRM: ${journey.crmEvent}`,
          `Complexity: ${journey.complexity}`,
          `Mode: ${journey.suggestedMode}`,
        ],
        COL[4],
        journeyStartY + index * journeySpacing,
        journey.phase
      )
    );
    edges.push({ id: `edge-journey-${journey.id}`, source: "journey", target: nodeId, label: journey.phase });
  });

  // Qualification + guardrails + modes (col 3 bottom / col 4 based on journey count)
  const rightOffset = journeys.length > 3 ? COL[4] : COL[3];
  nodes.push(createNode("qualification", "Qualification Logic", "qualification", ["Score threshold >= 70", "Consent-gated CRM handoff"], rightOffset, MID + 300));
  nodes.push(createNode("guardrails", "Guardrails", "guardrail", guardrails.slice(0, 5), rightOffset, MID + 520));
  nodes.push(createNode("modes", "APEX UI Modes", "mode", modes, rightOffset, MID - 320));

  edges.push({ id: "edge-center-qualification", source: "center", target: "qualification" });
  edges.push({ id: "edge-center-guardrails", source: "center", target: "guardrails" });
  edges.push({ id: "edge-center-modes", source: "center", target: "modes" });

  // Actions + analytics (col 5)
  nodes.push(createNode("actions", "Actions & Integrations", "action", actions.slice(0, 5), COL[5], MID - 160));
  nodes.push(createNode("analytics", "Analytics Events", "analytics", analyticsEvents.slice(0, 6).map((event) => event.name), COL[5], MID + 160));

  edges.push({ id: "edge-qualification-actions", source: "qualification", target: "actions" });
  edges.push({ id: "edge-qualification-analytics", source: "qualification", target: "analytics" });

  // Handoff + readiness (col 6)
  nodes.push(createNode("handoff", "Handoff Paths", "handoff", ["Engati CRM", "WhatsApp Business", "Advisor queue"], COL[6], MID - 160));
  nodes.push(createNode("readiness", "Production Readiness", "readiness", productionReadiness.map((item) => `${item.label}: ${item.status}`).slice(0, 5), COL[6], MID + 160));

  edges.push({ id: "edge-actions-handoff", source: "actions", target: "handoff" });
  edges.push({ id: "edge-analytics-readiness", source: "analytics", target: "readiness" });

  return { nodes, edges };
}
