import Markers from "@/views/species/markers/page";

export default function Page({ params }: { params: { name: string } }) {
  return <Markers params={params} />;
}
