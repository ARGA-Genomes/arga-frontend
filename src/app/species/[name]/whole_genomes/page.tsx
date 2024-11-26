import WholeGenome from "@/views/species/whole_genomes/page";

export default function Page({ params }: { params: { name: string } }) {
  return <WholeGenome params={params} />;
}
