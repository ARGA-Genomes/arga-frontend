"use client";

import { IconLiveState, IconSpecimenCollection, IconSpecimenRegistration, IconSubsample } from "@/components/ArgaIcons";
import { CardSlider } from "@/components/CardSlider";
import { CollectingSlide } from "@/components/slides/Collecting";
import { ExtractionSlide } from "@/components/slides/Extraction";
import { LiveStateSlide } from "@/components/slides/LiveState";
import { RegistrationsSlide } from "@/components/slides/Registrations";
import { TissueSlide } from "@/components/slides/Tissues";
import { TimelineNavbar } from "@/components/TimelineNavbar";
import { AccessionEvent, CollectionEvent, Organism, Tissue } from "@/generated/types";
import { gql, useQuery } from "@apollo/client";
import { Stack, Text, Title } from "@mantine/core";
import { use, useState } from "react";

const GET_ORGANISM = gql`
  query SpeciesSpecimens($entityId: String) {
    organism(by: { entityId: $entityId }) {
      ...OrganismDetails

      collections {
        ...CollectionEventDetails
      }

      accessions {
        ...AccessionEventDetails
      }

      tissues {
        ...TissueDetails
      }
    }
  }
`;

interface OrganismQuery {
  organism: Organism & {
    collections: CollectionEvent[];
    accessions: AccessionEvent[];
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
  const { loading, error, data } = useQuery<OrganismQuery>(GET_ORGANISM, {
    variables: { entityId },
  });

  const [card, setCard] = useState(0);
  return (
    <Stack>
      <Title order={3}>Organism provenance timeline</Title>
      <TimelineNavbar>
        <TimelineNavbar.Item label="Live state" icon={<IconLiveState size={60} />} onClick={() => setCard(0)} />
        <TimelineNavbar.Item
          label="Collecting"
          icon={<IconSpecimenCollection size={60} />}
          onClick={() => setCard(1)}
        />
        <TimelineNavbar.Item
          label="Registration"
          icon={<IconSpecimenRegistration size={60} />}
          onClick={() => setCard(2)}
        />
        <TimelineNavbar.Item
          label="Subsamples and tissues"
          icon={<IconSubsample size={60} />}
          onClick={() => setCard(3)}
        />
        <TimelineNavbar.Item
          label="Nucleic acid extraction"
          icon={<IconSubsample size={60} />}
          onClick={() => setCard(4)}
        />
      </TimelineNavbar>

      <CardSlider card={card}>
        <CardSlider.Card title="Live state">
          <LiveStateSlide />
        </CardSlider.Card>
        <CardSlider.Card title="Collecting events">
          {error && <Text>{error.message}</Text>}
          {data && <CollectingSlide organism={data.organism} accessions={[]} collections={data.organism.collections} />}
        </CardSlider.Card>
        <CardSlider.Card title="Registrations">
          <RegistrationsSlide />
        </CardSlider.Card>
        <CardSlider.Card title="Subsamples and tissues">
          {error && <Text>{error.message}</Text>}
          {data && <TissueSlide tissues={data.organism.tissues} />}
        </CardSlider.Card>
        <CardSlider.Card title="Nucleic acid extraction">
          {error && <Text>{error.message}</Text>}
          {data && <ExtractionSlide subsamples={[]} />}
        </CardSlider.Card>
      </CardSlider>
    </Stack>
  );
}
