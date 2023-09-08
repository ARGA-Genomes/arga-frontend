"use client";

import { gql, useQuery } from "@apollo/client";
import { Box, LoadingOverlay, Title, Text, useMantineTheme } from "@mantine/core";
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


function DatasetRow({ dataset }: { dataset: Dataset }) {
  return (
    <Box py={10} px={20}>
      <Title order={4}><Link target="_blank" href={dataset.url || ""}>{dataset.name}</Link></Title>
      <Text>{dataset.description}</Text>
      <Text c="dimmed">{dataset.citation}</Text>
      <Text c="dimmed">&copy; {dataset.rightsHolder}</Text>
      <Text c="dimmed">Last updated: {dataset.updatedAt}</Text>
    </Box>
  )
}


function SourceRow({ source }: { source: Source }) {
  return (
    <Box py={20}>
      <Title>{source.name}</Title>
      <Text c="dimmed">{source.author}</Text>
      <Text c="dimmed">&copy; {source.rightsHolder}</Text>
      { source.datasets.map(dataset => <DatasetRow dataset={dataset} key={dataset.name} />) }
    </Box>
  )
}

export default function DatasetsPage() {
  const theme = useMantineTheme();
  const { loading, error, data } = useQuery<QueryResults>(GET_DATASETS);

  return (
    <>
      <LoadingOverlay
        overlayColor={theme.colors.midnight[0]}
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
        radius="xl"
      />
      { data?.sources.map(source => <SourceRow source={source} key={source.name} />) }
    </>
  );
}
