import AccessionPage, {
  AccessionPageProps,
} from "@/views/species/whole_genomes/accession";

export default function Page({ params }: AccessionPageProps) {
  return <AccessionPage params={params} />;
}
