import AccessionPage from "@/views/species/whole_genomes/accession";


export default function Page({ params }: { params: { accession: string } }) {
  return <AccessionPage params={params} />;
}
