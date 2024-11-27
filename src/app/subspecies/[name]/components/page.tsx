import GenomicComponents from "@/views/species/components";

export default function Page({ params }: { params: { name: string } }) {
  return <GenomicComponents params={params} />;
}
