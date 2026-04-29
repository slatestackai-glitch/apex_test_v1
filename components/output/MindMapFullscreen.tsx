"use client";

import { MindMapCanvas } from "@/components/output/MindMapCanvas";
import { Modal } from "@/components/ui/Modal";
import { ApexProject } from "@/lib/projectSchema";

export function MindMapFullscreen({
  open,
  onClose,
  project,
}: {
  open: boolean;
  onClose: () => void;
  project: ApexProject;
}) {
  return (
    <Modal open={open} onClose={onClose} title="APEX Conversion Journey Mind Map" className="max-w-[96vw] p-0">
      <div className="h-[80vh]">
        <MindMapCanvas project={project} className="h-full rounded-none border-0" />
      </div>
    </Modal>
  );
}
