"use client";

import { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import type { V3Project } from "@/lib/v3/types";
import { buildV3MindMap } from "@/lib/v3/mindMapV3";

export function MindMapV3({ project }: { project: V3Project }) {
  const { nodes, edges } = useMemo(() => buildV3MindMap(project), [project]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
    >
      <Background gap={20} color="#F0F0F0" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
