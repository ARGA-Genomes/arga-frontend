import GenomicComponents from "@/views/species/components";

export default async function Page(props: { params: Promise<{ name: string }> }) {
  const params = await props.params;
  return <GenomicComponents params={params} />;
}
