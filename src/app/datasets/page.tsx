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

function SourceRow({ source }: { source: Source }) {
  return (
    <Paper p="l" radius="lg" withBorder style={{ border: 'solid 1px var(--mantine-color-moss-4)' }}>
      <Grid p={10} columns={22}>
        <Grid.Col span={3}>
          <Attribute label="Data source name" value={source.name}/>
        </Grid.Col>
        <Grid.Col span={19}>
          <Attribute label="Rights holder" value={source.rightsHolder}/>
        </Grid.Col>
        <Grid.Col span={12}>
          <Attribute label="Access rights" value={source.accessRights}/>
        </Grid.Col>
        <Grid.Col span={3}>
          <Attribute label="Number of records" value="No data"/>
        </Grid.Col>
        <Grid.Col span={3}>
          <Attribute label="Last updated" value="No data"/>
        </Grid.Col>
        <Grid.Col span={4}>
          <Box m="md">
            <Button w={170}></Button>
          </Box>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

export default function DatasetsPage() {
  const { loading, error, data } = useQuery<QueryResults>(GET_DATASETS);

  return (
    <>
      <Box p={20}>
        <Title>Data sources indexed in ARGA</Title>
        <Paper p="xs" radius="lg" withBorder style={{ border: 'solid 1px var(--mantine-color-moss-4)' }}>
          <LoadOverlay visible={loading} />
          { data?.sources.map(source => <SourceRow source={source} key={source.name} />) }
        </Paper>
      </Box>
    </>
  );
}
