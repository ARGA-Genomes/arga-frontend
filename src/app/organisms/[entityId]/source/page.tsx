"use client";

import classes from "./page.module.css";

import { IconLiveState, IconSpecimenCollection, IconSpecimenRegistration, IconSubsample } from "@/components/ArgaIcons";
import { CardSlider } from "@/components/CardSlider";
import { AttributePillContainer } from "@/components/data-fields";
import { CollectingSlide } from "@/components/slides/Collecting";
import { LiveStateSlide } from "@/components/slides/LiveState";
import { RegistrationsSlide } from "@/components/slides/Registrations";
import { TimelineNavbar } from "@/components/TimelineNavbar";
import { AccessionEvent, CollectionEvent, Organism } from "@/queries/specimen";
import { gql, useQuery } from "@apollo/client";
import { Center, Grid, Group, Paper, Skeleton, Stack, Text, Title } from "@mantine/core";
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
    }
  }
`;

interface OrganismQuery {
  organism: Organism & {
    collections: CollectionEvent[];
    accessions: AccessionEvent[];
  };
}

interface PageProps {
  params: Promise<{ entityId: string }>;
}

export default function Page(props: PageProps) {
  const params = use(props.params);

  return (
    <Stack gap="xl">
      <Overview entityId={params.entityId} />
      <Provenance entityId={params.entityId} />
    </Stack>
  );
}

function Overview({ entityId }: { entityId: string }) {
  const { loading, error, data } = useQuery<OrganismQuery>(GET_ORGANISM, {
    variables: { entityId },
  });

  return (
    <Paper radius="lg" p={20} bg="wheatBg.0">
      <Title order={3} c="wheat">
        Organism overview
      </Title>

      {error?.message}

      <Grid>
        <Grid.Col span={6}>
          <Grid>
            <Grid.Col span={8}>
              <Stack>
                <OverviewBlock title="Scientific name" loading={loading}>
                  <AttributePillContainer className={classes.pill} color="white">
                    {data?.organism.entityId}
                  </AttributePillContainer>
                </OverviewBlock>
                <Group>
                  <AttributePillContainer
                    className={classes.holotypePill}
                    color="white"
                    withBorder={false}
                  ></AttributePillContainer>
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack>
                <Stack gap="sm">
                  <Text fw={700} c="midnight" fz="xs">
                    Source organism scope
                  </Text>
                  <Center></Center>
                </Stack>
                <Stack gap="sm">
                  <Text fw={700} c="midnight" fz="xs">
                    Biome
                  </Text>
                  <Center></Center>
                </Stack>
              </Stack>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={3}>
          <OverviewBlock title="Associated organisms" loading={loading}></OverviewBlock>
        </Grid.Col>
        <Grid.Col span={3}>
          <OverviewBlock title="External links" loading={loading}></OverviewBlock>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

interface OverviewBlockProps {
  title: string;
  children?: React.ReactNode;
  loading: boolean;
}

function OverviewBlock({ title, children, loading }: OverviewBlockProps) {
  return (
    <Skeleton visible={loading} radius="md" className={classes.skeletonOverview}>
      <Paper radius="lg" p={20} bg="wheatBg.0" withBorder style={{ borderColor: "var(--mantine-color-wheatBg-1)" }}>
        <Stack gap="sm">
          <Text fw={700} c="midnight" fz="xs">
            {title}
          </Text>
          <Center>{children}</Center>
        </Stack>
      </Paper>
    </Skeleton>
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
      </TimelineNavbar>

      <CardSlider card={card}>
        <CardSlider.Card title="Live state">
          <LiveStateSlide />
        </CardSlider.Card>
        <CardSlider.Card title="Collecting events">
          {error && <Text>{error.message}</Text>}
          {data && <CollectingSlide accessions={[]} collections={data.organism.collections} />}
        </CardSlider.Card>
        <CardSlider.Card title="Registrations">
          <RegistrationsSlide />
        </CardSlider.Card>
        <CardSlider.Card title="Subsamples and tissues"></CardSlider.Card>
      </CardSlider>
    </Stack>
  );
}
