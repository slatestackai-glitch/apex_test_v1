import { DemoExperienceV3 } from "@/components/v3/demo/DemoExperienceV3";

export default function DemoPage({ params }: { params: { projectId: string } }) {
  return <DemoExperienceV3 projectId={params.projectId} />;
}
