import Taxonomy from "@/views/species/taxonomy";

export default function Page({ params }: { params: { name: string } }) {
  return <Taxonomy params={params} isSubspecies />;
}
