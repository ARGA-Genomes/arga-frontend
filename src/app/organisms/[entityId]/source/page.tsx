"use client";

import classes from "./page.module.css";

import { AccessionEvent, CollectionEvent, Organism } from "@/queries/specimen";
import { gql, useQuery } from "@apollo/client";
import { Grid, Paper, Stack, Text, Title, Skeleton, Center, Group } from "@mantine/core";
import { AttributePillContainer } from "@/components/data-fields";
import { use } from "react";

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
    </Stack>
  );
}

function Overview({ entityId }: { entityId: string }) {
  const { loading, error, data } = useQuery<OrganismQuery>(GET_ORGANISM, {
    variables: { entityId },
  });

  function col<T, R>(value?: T, retValue?: R): R | undefined {
    return value ? retValue : undefined;
  }

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
                    color={col(undefined, "white")}
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
