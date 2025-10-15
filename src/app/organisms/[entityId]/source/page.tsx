"use client";

import { MAX_WIDTH } from "@/app/constants";
import { IconLiveState, IconSpecimenCollection, IconSpecimenRegistration, IconSubsample } from "@/components/ArgaIcons";
import { CardSlider } from "@/components/CardSlider";
import { CollectingSlide } from "@/components/slides/Collecting";
import { LiveStateSlide } from "@/components/slides/LiveState";
import { RegistrationSlide } from "@/components/slides/Registrations";
import { TimelineNavbar } from "@/components/TimelineNavbar";
import { Organism } from "@/generated/types";
import { gql, useQuery } from "@apollo/client";
import { Container, Stack, Text, Title } from "@mantine/core";
import { use, useState } from "react";

const GET_ORGANISM = gql`
  query Organism($entityId: String) {
    organism(by: { entityId: $entityId }) {
      ...OrganismDetails

      publication {
        doi
        citation
      }

      collections {
        ...CollectionDetails

        publication {
          doi
          citation
        }
      }

      registrations {
        ...RegistrationDetails

        publication {
          doi
          citation
        }
      }

      tissues {
        ...TissueDetails

        publication {
          doi
          citation
        }
      }
    }
  }
`;

interface OrganismQuery {
  organism: Organism;
}

interface PageProps {
  params: Promise<{ entityId: string }>;
}

export default function Page(props: PageProps) {
  const params = use(props.params);

  return (
    <Stack gap="xl">
      <Container w="100%" maw={MAX_WIDTH}>
        <Title order={3}>Organism provenance timeline</Title>
      </Container>
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
      <TimelineNavbar selected={card} onSelected={setCard}>
        <TimelineNavbar.Item label="Live state" icon={<IconLiveState size={60} />} />
        <TimelineNavbar.Item label="Collecting" icon={<IconSpecimenCollection size={60} />} />
        <TimelineNavbar.Item label="Registration" icon={<IconSpecimenRegistration size={60} />} />
        <TimelineNavbar.Item
          label="Subsamples and tissues"
          icon={<IconSubsample size={60} />}
          href="subsamples_and_tissues"
        />
      </TimelineNavbar>

      <CardSlider card={card} onSelected={setCard}>
        <CardSlider.Card title="Live state" size="md">
          {error && <Text>{error.message}</Text>}
          {data && <LiveStateSlide organism={data.organism} />}
        </CardSlider.Card>
        <CardSlider.Card title="Collecting" size="lg">
          {error && <Text>{error.message}</Text>}
          {data && (
            <CollectingSlide
              organism={data.organism}
              registrations={data.organism.registrations}
              collections={data.organism.collections}
            />
          )}
        </CardSlider.Card>
        <CardSlider.Card title="Registrations" size="lg">
          {data && <RegistrationSlide registrations={data.organism.registrations} />}
        </CardSlider.Card>
        <CardSlider.LinkedCard title="Subsamples and tissues" href="subsamples_and_tissues" />
      </CardSlider>
    </Stack>
  );
}
