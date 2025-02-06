"use client";

import { LoadOverlay } from "@/components/load-overlay";
import { gql, useQuery } from "@apollo/client";
import { Box, Grid, Title, Paper, Button } from "@mantine/core";
import { Attribute } from "@/components/highlight-stack";
import Link from "next/link";

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
  }
`;

interface Dataset {
  globalId: string;
  name: string;
  shortName?: string;
  description?: string;
  url?: string;
  citation?: string;
  license?: string;
  rightsHolder?: string;
  createdAt: string;
  updatedAt: string;
}

interface Source {
  name: string;
  author: string;
  rightsHolder: string;
  accessRights: string;
  license: string;
  datasets: Dataset[];
}

interface QueryResults {
  sources: Source[];
}

function RecordItemContent({ dataset }: { dataset: Dataset }) {
  return (
    <Paper
      radius="lg"
      m="xs"
      withBorder
      style={{ border: "solid 1px var(--mantine-color-moss-4)" }}
    >
      <Grid p={10} columns={24}>
        <Grid.Col span={7}>
          <Attribute label="Collection name" value={dataset.name} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Attribute label="Number of records" value="No data" />
        </Grid.Col>
        <Grid.Col span={5}>
          <Attribute label="Percentage with genomic data" value="No data" />
        </Grid.Col>
        <Grid.Col span={6}>
          <Attribute label="Last updated" value={dataset.updatedAt} />
        </Grid.Col>
        <Grid.Col span={2}>
          <Button
            m={15}
            component={Link}
            href={dataset.url || ""}
            rel="noopener noreferrer"
            target="_blank"
          ></Button>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function SourceRow({ source }: { source: Source }) {
  return (
    <Paper
      p="l"
      radius="lg"
      withBorder
      style={{ border: "solid 1px var(--mantine-color-moss-4)" }}
    >
      <Grid p={10} columns={24}>
        <Grid.Col span={5}>
          <Attribute label="Institution name" value={source.name} />
        </Grid.Col>
        <Grid.Col span={7}>
          <Attribute label="Access rights" value={source.accessRights} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Attribute label="Number of records" value="No data" />
        </Grid.Col>
        <Grid.Col span={5}>
          <Attribute label="Percentage with genomic data" value="No data" />
        </Grid.Col>
        <Grid.Col span={4}>
          <Attribute label="Last updated" value="No data" />
        </Grid.Col>
      </Grid>
      <Box ml={60}>
        {source.datasets.map((dataset) => (
          <RecordItemContent dataset={dataset} key={dataset.name} />
        ))}
      </Box>
    </Paper>
  );
}

export default function DatasetsPage() {
  const { loading, data } = useQuery<QueryResults>(GET_DATASETS);

  return (
    <>
      <Box p={20}>
        <Title>Institutions</Title>
        <Paper
          p="xs"
          radius="lg"
          withBorder
          style={{ border: "solid 1px var(--mantine-color-moss-4)" }}
        >
          <LoadOverlay visible={loading} />
          {data?.sources.map((source) => (
            <SourceRow source={source} key={source.name} />
          ))}
        </Paper>
      </Box>
    </>
  );
}
