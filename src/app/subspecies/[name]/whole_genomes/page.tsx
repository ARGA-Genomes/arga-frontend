import WholeGenome from "@/views/species/whole_genomes/page";

export default function Page(props: { params: Promise<{ name: string }> }) {
  return <WholeGenome {...props} />;
}
