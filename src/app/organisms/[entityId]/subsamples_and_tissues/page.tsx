"use client";

import { IconGenomicDataProcessing, IconSourceOrganism, IconSubsample } from "@/components/ArgaIcons";
import { CardSlider } from "@/components/CardSlider";
import { TissueSlide } from "@/components/slides/Tissues";
import { TimelineNavbar } from "@/components/TimelineNavbar";
import { Tissue } from "@/generated/types";
import { gql, useQuery } from "@apollo/client";
import { Stack, Text, Title } from "@mantine/core";
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
      <Title order={3}>Organism subsampling timeline</Title>
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
        <CardSlider.Card title="Subsamples and tissues">
          {error && <Text>{error.message}</Text>}
          {data && <TissueSlide tissues={data.organism.tissues} />}
        </CardSlider.Card>
        <CardSlider.Card title="Nucleic acid extraction" />
      </CardSlider>
    </Stack>
  );
}
