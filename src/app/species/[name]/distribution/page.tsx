import DistributionPage from "@/views/species/distribution";

interface PageProps {
  params: Promise<{
    name: string;
  }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  return <DistributionPage params={params} />;
}
