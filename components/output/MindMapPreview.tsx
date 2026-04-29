"use client";

import { useState } from "react";

import { Expand } from "lucide-react";

import { MindMapCanvas } from "@/components/output/MindMapCanvas";
import { MindMapFullscreen } from "@/components/output/MindMapFullscreen";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ApexProject } from "@/lib/projectSchema";

export function MindMapPreview({ project }: { project: ApexProject }) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold">Mind Map Preview</h3>
        <Button variant="outline" size="sm" onClick={() => setFullscreen(true)}>
          <Expand className="h-4 w-4" />
          Full-screen mind map
        </Button>
      </div>

      <MindMapCanvas project={project} />

      <MindMapFullscreen open={fullscreen} onClose={() => setFullscreen(false)} project={project} />
    </Card>
  );
}
