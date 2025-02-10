import Taxonomy from "@/views/species/taxonomy";

export default async function Page(props: { params: Promise<{ name: string }> }) {
  const params = await props.params;
  return <Taxonomy params={params} isSubspecies />;
}
