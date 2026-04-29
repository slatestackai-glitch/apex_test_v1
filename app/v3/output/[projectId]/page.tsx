import { OutputPageV3 } from "@/components/v3/output/OutputPageV3";

export default function OutputPage({ params }: { params: { projectId: string } }) {
  return <OutputPageV3 projectId={params.projectId} />;
}
