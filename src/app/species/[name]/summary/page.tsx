import { MAX_WIDTH } from "@/app/constants";
import SummaryPage from "@/views/species/summary";
import { Container } from "@mantine/core";

interface PageProps {
  params: Promise<{
    name: string;
  }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <Container w="100%" maw={MAX_WIDTH}>
      <SummaryPage params={params} />
    </Container>
  );
}
