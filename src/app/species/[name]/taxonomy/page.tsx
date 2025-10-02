import { MAX_WIDTH } from "@/app/constants";
import Taxonomy from "@/views/species/taxonomy";
import { Container } from "@mantine/core";

export default async function Page(props: { params: Promise<{ name: string }> }) {
  const params = await props.params;
  return (
    <Container w="100%" maw={MAX_WIDTH}>
      <Taxonomy params={params} />
    </Container>
  );
}
