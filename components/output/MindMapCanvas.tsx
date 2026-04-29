"use client";

import { useMemo, useState } from "react";

import ReactFlow, { Background, Controls, Edge, MiniMap, Node, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import { Info } from "lucide-react";

import { ApexProject, MindMapNode } from "@/lib/projectSchema";
import { cn } from "@/lib/utils";

const groupColors: Record<MindMapNode["group"], string> = {
  center: "#0B5ED7",
  entry: "#3B82F6",
  intent: "#1D4ED8",
  journey: "#0A2540",
  qualification: "#14532d",
  mode: "#4338ca",
  knowledge: "#0f766e",
  action: "#92400e",
  guardrail: "#b45309",
  analytics: "#0369a1",
  handoff: "#be123c",
  readiness: "#4b5563",
};

export function MindMapCanvas({ project, className }: { project: ApexProject; className?: string }) {
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(project.mindMap.nodes[0] ?? null);

  const nodes = useMemo<Node[]>(
    () =>
      project.mindMap.nodes.map((node) => ({
        id: node.id,
        position: { x: node.x, y: node.y },
        data: { label: node.label },
        style: {
          borderRadius: 10,
          border: `1px solid ${groupColors[node.group]}`,
          background: "#fff",
          color: "#0A2540",
          padding: 8,
          fontSize: 12,
          width: node.group === "center" ? 210 : 180,
          boxShadow: "0 6px 14px rgba(10,37,64,0.08)",
        },
      })),
    [project.mindMap.nodes]
  );

  const edges = useMemo<Edge[]>(
    () =>
      project.mindMap.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: "smoothstep",
        animated: false,
        style: { stroke: "#9BB2D4", strokeWidth: 1.5 },
        labelStyle: { fill: "#4B5563", fontSize: 10 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#9BB2D4", width: 12, height: 12 },
      })),
    [project.mindMap.edges]
  );

  return (
    <div className={cn("grid h-[520px] gap-3 lg:grid-cols-[minmax(0,1fr)_280px]", className)}>
      <div className="rounded-xl border border-[var(--apex-border)] bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          onNodeClick={(_, node) => {
            const found = project.mindMap.nodes.find((item) => item.id === node.id) ?? null;
            setSelectedNode(found);
          }}
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Background color="#eef3fb" gap={18} />
          <MiniMap zoomable pannable />
          <Controls showInteractive />
        </ReactFlow>
      </div>

      <aside className="rounded-xl border border-[var(--apex-border)] bg-[var(--apex-section-bg)] p-3">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Info className="h-4 w-4 text-[var(--apex-blue)]" />
          Node detail drawer
        </p>

        {selectedNode ? (
          <>
            <p className="text-sm font-semibold">{selectedNode.label}</p>
            <p className="mt-1 text-xs text-[var(--apex-text-secondary)]">Group: {selectedNode.group}</p>
            {selectedNode.phase ? <p className="text-xs text-[var(--apex-text-secondary)]">Phase: {selectedNode.phase}</p> : null}
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--apex-text-secondary)]">
              {selectedNode.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-[var(--apex-text-secondary)]">Select any node to inspect details.</p>
        )}
      </aside>
    </div>
  );
}
