"use client";

import { IconSubsample } from "@/components/ArgaIcons";
import { CardSlider } from "@/components/CardSlider";
import { ExtractionSlide } from "@/components/slides/Extraction";
import { TimelineNavbar } from "@/components/TimelineNavbar";
import { Subsample } from "@/generated/types";
import { gql, useQuery } from "@apollo/client";
import { Stack, Text, Title } from "@mantine/core";
import { use, useState } from "react";

const GET_SUBSAMPLES = gql`
  query OrganismSubsamples($entityId: String) {
    organism(by: { entityId: $entityId }) {
      ...OrganismDetails

      subsamples {
        ...SubsampleDetails
      }
    }
  }
`;

interface OrganismQuery {
  organism: {
    subsamples: Subsample[];
  };
}

interface PageProps {
  params: Promise<{ entityId: string }>;
}

export default function Page(props: PageProps) {
  const params = use(props.params);

  return (
    <Stack gap="xl">
      <Provenance entityId={params.entityId} />
    </Stack>
  );
}

function Provenance({ entityId }: { entityId: string }) {
  const { loading, error, data } = useQuery<OrganismQuery>(GET_SUBSAMPLES, {
    variables: { entityId },
  });

  const [card, setCard] = useState(0);
  return (
    <Stack>
      <Title order={3}>Organism subsampling timeline</Title>
      <TimelineNavbar>
        <TimelineNavbar.Item label="Subsamples and tissues" icon={<IconSubsample size={60} />} />
        <TimelineNavbar.Item
          label="Nucleic acid extraction"
          icon={<IconSubsample size={60} />}
          onClick={() => setCard(0)}
        />
        <TimelineNavbar.Item label="Genetic data products" icon={<IconSubsample size={60} />} />
      </TimelineNavbar>

      <CardSlider card={card}>
        <CardSlider.Card title="Nucleic acid extraction">
          {error && <Text>{error.message}</Text>}
          {data && <ExtractionSlide subsamples={data.organism.subsamples} />}
        </CardSlider.Card>
        <CardSlider.Card title="Genetic data products"></CardSlider.Card>
      </CardSlider>
    </Stack>
  );
}
