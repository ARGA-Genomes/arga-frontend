import DistributionPage from "@/views/species/distribution/page";

interface PageProps {
  params: {
    name: string;
  };
}

export default function Page({ params }: PageProps) {
  return <DistributionPage params={params} />;
}
