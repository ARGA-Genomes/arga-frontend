import MarkerAccession from "@/views/species/markers/accession";

export default async function Page(props: { params: Promise<{ accession: string }> }) {
  const params = await props.params;
  return <MarkerAccession params={params} />;
}
