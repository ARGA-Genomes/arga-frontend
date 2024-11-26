import Specimens from "@/views/species/specimens/page";

export default function Page({ params }: { params: { name: string } }) {
  return <Specimens params={params} />;
}
