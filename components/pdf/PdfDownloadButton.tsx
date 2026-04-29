"use client";

import { useState } from "react";

import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";

import { ApexPdfDocument } from "@/components/pdf/ApexPdfDocument";
import { Button } from "@/components/ui/Button";
import { ApexProject } from "@/lib/projectSchema";

export function PdfDownloadButton({ project }: { project: ApexProject }) {
  const [downloading, setDownloading] = useState(false);

  async function onDownload() {
    setDownloading(true);
    try {
      const blob = await pdf(<ApexPdfDocument project={project} />).toBlob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${project.client.replace(/\s+/g, "-").toLowerCase()}-apex-package.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Button onClick={onDownload} disabled={downloading}>
      <Download className="h-4 w-4" />
      {downloading ? "Preparing PDF..." : "Download PDF"}
    </Button>
  );
}
