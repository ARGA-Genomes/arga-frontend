"use client";

import { LoadOverlay } from "@/components/load-overlay";
import { gql, useQuery } from "@apollo/client";
import { Grid, Title, Paper, Button, Stack, Container } from "@mantine/core";
import Link from "next/link";
import { DateTime } from "luxon";
import { AttributePill } from "@/components/data-fields";
import { ExternalLink } from "tabler-icons-react";
import { MAX_WIDTH } from "../constants";


const GET_DATASETS = gql`
query DatasetsAndSources {
  sources {
    name
    author
    rightsHolder
    accessRights
    license

    datasets {
      globalId
      name
      shortName
      description
      url
      citation
      license
      rightsHolder
      createdAt
      updatedAt
    }
  }
}`;

type Dataset = {
  globalId: string,
  name: string,
  shortName?: string,
  description?: string,
  url?: string,
  citation?: string,
  license?: string,
  rightsHolder?: string,
  createdAt: string,
  updatedAt: string,
}

type Source = {
  name: string,
  author: string,
  rightsHolder: string,
  accessRights: string,
  license: string,
  datasets: Dataset[],
}

type QueryResults = {
  sources: Source[],
};


function DatasetRow({ dataset }: { dataset: Dataset }) {
  return (
    <Paper radius="lg">
      <Grid>
        <Grid.Col span={4} p="lg">
          <AttributePill label="Data source name" value={dataset.name} />
        </Grid.Col>
        <Grid.Col span={3} p="lg">
          <AttributePill label="Rights holder" value={dataset.rightsHolder} />
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill label="Access rights" value={dataset.license} />
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill label="Last updated" value={DateTime.fromISO(dataset.updatedAt).toLocaleString()} />
        </Grid.Col>
        <Grid.Col span={1}>
          <Link href={dataset.url || "#"}>
            <Button
              w="100%"
              h="100%"
              color="midnight"
              style={{ borderRadius: "0 16px 16px 0" }}
              disabled={!dataset.url}
            >
              <Stack align="center">
                <ExternalLink size="30px" />
                Go to source
              </Stack>
            </Button>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}


function SourceRow({ source }: { source: Source }) {
  return (
    <Stack>
      <Title order={4}>{source.name}</Title>
      <Stack>
        { source.datasets.map((dataset, idx) => <DatasetRow dataset={dataset} key={idx} />) }
      </Stack>
    </Stack>
  )
}

export default function DatasetsPage() {
  const { loading, error, data } = useQuery<QueryResults>(GET_DATASETS);

  return (
      <Stack gap="xl" my="xl">
        <Paper py={20} pos="relative">
          <Container maw={MAX_WIDTH}>
            <Title>Data sources indexed in ARGA</Title>
          </Container>
        </Paper>

        <Paper py="lg">
          <Container maw={MAX_WIDTH}>
            <Paper p="lg" radius="lg" withBorder>
              <LoadOverlay visible={loading} />
              <Stack gap={50}>
                { data?.sources.map(source => <SourceRow source={source} key={source.name} />) }
              </Stack>
            </Paper>
          </Container>
        </Paper>
      </Stack>
  );
}
