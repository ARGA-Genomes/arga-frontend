"use client";

import { MAX_WIDTH } from "@/app/constants";
import { IconGenomicDataProcessing, IconSourceOrganism, IconSubsample } from "@/components/ArgaIcons";
import { CardSlider } from "@/components/CardSlider";
import { TissueSlide } from "@/components/slides/Tissues";
import { TimelineNavbar } from "@/components/TimelineNavbar";
import { Tissue } from "@/generated/types";
import { gql, useQuery } from "@apollo/client";
import { Container, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { use, useState } from "react";

const GET_SUBSAMPLES = gql`
  query OrganismSubsamples($entityId: String) {
    organism(by: { entityId: $entityId }) {
      tissues {
        ...TissueDetails
      }
    }
  }
`;

interface OrganismQuery {
  organism: {
    tissues: Tissue[];
  };
}

interface PageProps {
  params: Promise<{ entityId: string }>;
}

export default function Page(props: PageProps) {
  const params = use(props.params);

  return (
    <Stack gap="xl">
      <Container w="100%" maw={MAX_WIDTH}>
        <Title order={3}>Organism subsampling timeline</Title>
      </Container>
      <Provenance entityId={params.entityId} />
    </Stack>
  );
}

function Provenance({ entityId }: { entityId: string }) {
  const { loading, error, data } = useQuery<OrganismQuery>(GET_SUBSAMPLES, {
    variables: { entityId },
  });

  const [card, setCard] = useState(1);
  return (
    <Stack>
      <TimelineNavbar selected={card} onSelected={setCard}>
        <Link href="source">
          <TimelineNavbar.Item label="Source organism" icon={<IconSourceOrganism size={60} />} />
        </Link>
        <TimelineNavbar.Item label="Subsamples and tissues" icon={<IconSubsample size={60} />} />
        <Link href="data_preparation">
          <TimelineNavbar.Item
            label="Genomic and genetic data processing"
            icon={<IconGenomicDataProcessing size={60} />}
          />
        </Link>
      </TimelineNavbar>

      <CardSlider card={card}>
        <CardSlider.Card title="Source organism" />
        <CardSlider.Card title="Subsamples and tissues" size="lg">
          {error && <Text>{error.message}</Text>}
          {data && <TissueSlide tissues={data.organism.tissues} />}
        </CardSlider.Card>
        <CardSlider.Card title="Nucleic acid extraction" />
      </CardSlider>
    </Stack>
  );
}
