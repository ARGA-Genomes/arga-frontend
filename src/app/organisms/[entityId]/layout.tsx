"use client";
import { use } from "react";

import classes from "./layout.module.css";

import { Container, Grid, Group, Paper, Skeleton, Stack, Tabs, Title, Text } from "@mantine/core";
import { RedirectType, redirect, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { MAX_WIDTH } from "@/app/constants";
import { PreviousPage } from "@/components/navigation-history";
import { Organism } from "@/generated/types";
import { gql, useQuery } from "@apollo/client";
import { Pill } from "@/components/Pills";
import OrganismHeader from "@/components/OrganismHeader";

const GET_ORGANISM_OVERVIEW = gql`
  query OrganismOverview($entityId: String) {
    organism(by: { entityId: $entityId }) {
      ...OrganismDetails

      name {
        canonicalName
        authorship
      }
    }
  }
`;

interface OrganismQuery {
  organism: Organism;
}

function DataTabs({ entityId, children }: { entityId: string; children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  function changeTab(value: string | null) {
    if (value !== null) {
      router.replace(`/organisms/${entityId}/${value}`);
    }
  }

  // based on the current url the active tab should always be
  // the fourth component in the path name
  const tab = path.split("/")[3];

  if (!tab) redirect(`/organisms/${entityId}/source`, RedirectType.replace);

  return (
    <Tabs
      variant="unstyled"
      radius={10}
      mt="sm"
      defaultValue="summary"
      classNames={classes}
      value={tab}
      onChange={changeTab}
    >
      <Container maw={MAX_WIDTH}>
        <Tabs.List>
          <Tabs.Tab value="source">Source organism</Tabs.Tab>
          <Tabs.Tab value="subsamples_and_tissues">Subsamples and tissues</Tabs.Tab>
          <Tabs.Tab value="data_preparation">Nucleic acid extracts</Tabs.Tab>
          <Tabs.Tab value="data_products">Genomic and genetic data products</Tabs.Tab>
        </Tabs.List>
      </Container>

      <Paper pos="relative" py="md">
        <Stack>
          <Overview entityId={entityId} />
          {children}
        </Stack>
      </Paper>
    </Tabs>
  );
}

interface OrganismLayoutProps {
  params: Promise<{ entityId: string }>;
  children: React.ReactNode;
}

export default function OrganismLayout(props: OrganismLayoutProps) {
  const params = use(props.params);
  const { children } = props;

  return (
    <Stack gap={0} mt="xl">
      <Container mb={20} w="100%" maw={MAX_WIDTH}>
        <PreviousPage />
      </Container>

      <OrganismHeader entityId={params.entityId} />

      <DataTabs entityId={params.entityId}>{children}</DataTabs>
    </Stack>
  );
}

function Overview({ entityId }: { entityId: string }) {
  const { loading, error, data } = useQuery<OrganismQuery>(GET_ORGANISM_OVERVIEW, {
    variables: { entityId },
  });

  return (
    <Paper py="lg" bg="wheatBg.0" className={classes.overviewContent}>
      <Container maw={MAX_WIDTH}>
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
                    <Stack>
                      {data && <Pill.ScientificName name={data.organism.name} variant="overview" />}
                      <Group>Identification verified</Group>
                    </Stack>
                  </OverviewBlock>
                  <Group justify="space-between">
                    <Group></Group>
                    <Pill.SpecimenStatus />
                  </Group>
                </Stack>
              </Grid.Col>
              <Grid.Col span={4}>
                <Stack>
                  <Stack gap="sm">
                    Source organism scope
                    <Pill.StandardText value={data?.organism.disposition} variant="overview" />
                  </Stack>
                  <Stack gap="sm">
                    Biome
                    <Pill.StandardText value={data?.organism.biome} variant="overview" />
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
      </Container>
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
          {children}
        </Stack>
      </Paper>
    </Skeleton>
  );
}
