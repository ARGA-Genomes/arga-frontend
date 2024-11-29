import MarkerAccession from "@/views/species/markers/accession";

export default function Page({ params }: { params: { accession: string } }) {
  return <MarkerAccession params={params} />;
}
