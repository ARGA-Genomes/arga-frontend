import SpecimenAccession from "@/views/species/specimens/accession";

export default function Page({ params }: { params: { accession: string } }) {
  return <SpecimenAccession params={params} />;
}
