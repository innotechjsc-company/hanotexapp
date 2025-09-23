import TechnologyDetailScreen from "@/screens/technology/detail";

export default function TechnologyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <TechnologyDetailScreen id={params.id} />;
}
