import SpecimenAccession from "@/views/species/specimens/accession";

export default async function Page(props: { params: Promise<{ accession: string }> }) {
  const params = await props.params;
  return <SpecimenAccession params={params} />;
}
