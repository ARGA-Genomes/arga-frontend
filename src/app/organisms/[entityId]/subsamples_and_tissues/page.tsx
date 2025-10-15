"use client";

import { MAX_WIDTH } from "@/app/constants";
import {
  IconExtraction,
  IconSourceOrganism,
  IconSubsample,
} from "@/components/ArgaIcons";
import { CardSlider } from "@/components/CardSlider";
import { TissueSlide } from "@/components/slides/Tissues";
import { TimelineNavbar } from "@/components/TimelineNavbar";
import { Tissue } from "@/generated/types";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Container, Stack, Text, Title } from "@mantine/core";
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
        <TimelineNavbar.Item
          label="Source organism"
          icon={<IconSourceOrganism size={60} />}
          href="source"
        />
        <TimelineNavbar.Item
          label="Subsamples and tissues"
          icon={<IconSubsample size={60} />}
        />
        <TimelineNavbar.Item
          label="Nucleic acid extracts"
          icon={<IconExtraction size={60} />}
          href="data_preparation"
        />
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
