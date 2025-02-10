import SummaryPage from "@/views/species/summary";

interface PageProps {
  params: Promise<{
    name: string;
  }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  return <SummaryPage params={params} />;
}
