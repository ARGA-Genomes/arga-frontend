import SummaryPage from "@/views/species/summary";

interface PageProps {
  params: {
    name: string;
  };
}

export default function Page({ params }: PageProps) {
  return <SummaryPage params={params} />;
}
