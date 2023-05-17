'use client';

import { gql, useQuery } from '@apollo/client';

import { Text, Paper, Title, createStyles, Chip, Box, Card, Group, Flex, Stack, Grid, Container, SegmentedControl, Center, CardSection, Space } from "@mantine/core";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Record = {
  scientificName: string,
  canonicalName?: string,
  rank?: string,
  taxonomicStatus?: string,
  commonNames?: string[],
  score: number,
};

type FullTextResults = {
  records: Record[],
}

type SearchResults = {
  fullText: FullTextResults,
};

type QueryResults = {
  search: SearchResults,
};

const SEARCH_FULLTEXT = gql`
query FullTextSearch ($query: String) {
  search {
    fullText (query: $query) {
      records {
        ... on TaxonItem {
          scientificName,
          canonicalName,
          rank,
          taxonomicStatus,
          commonNames,
          score,
        }
      }
    }
  }
}`


function SearchItem({ item } : { item: Record }) {
  const itemLinkName = item.canonicalName?.replaceAll(" ", "_");

  return (
    <Paper my={30} h={70} radius="lg" bg="bushfire.5">
      <Grid p={0}>
        <Grid.Col span="content">
          <Space w="md" />
        </Grid.Col>
        <Grid.Col span="auto" p={0}>
          <Link href={`/species/${itemLinkName}`}>
            <Paper bg="white" h={70} radius="lg" p={10}>
              <Text>{item.scientificName}</Text>
              <Text c="dimmed">{item.commonNames?.join(", ")}</Text>
            </Paper>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

function SearchResults({ results } : { results: Record[] }) {
  return (
    <Box>
      {results.map(record => (
        <SearchItem item={record} key={record.scientificName} />
      ))}
    </Box>
  )
}


export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const { loading, error, data } = useQuery<QueryResults>(SEARCH_FULLTEXT, {
    variables: {
      query,
    }
  });
  if (error) return <p>Error : {error.message}</p>;
  if (loading) return <Text>Loading...</Text>;
  if (!data) return <Text>No data</Text>;

  return (
    <Container>
      <Paper bg="midnight.6" radius="lg" p="xl">
        <Title color="white" align='center'>Search results</Title>
        <Text my="lg" c="dimmed">Query: {query}</Text>

        <SegmentedControl size="lg" radius="lg" fullWidth color="bushfire.4" data={[
          {
            value: 'all',
            label: (
              <Center>
                <Box ml={10}>All</Box>
              </Center>
            ),
          },
          {
            value: 'species',
            label: (
              <Center>
                <Box ml={10}>Species</Box>
              </Center>
            ),
          },
          {
            value: 'whole_genomes',
            label: (
              <Center>
                <Box ml={10}>Whole Genomes</Box>
              </Center>
            ),
          },
          {
            value: 'barcodes',
            label: (
              <Center>
                <Box ml={10}>Barcodes</Box>
              </Center>
            ),
          },
        ]} />
      </Paper>

      <SearchResults results={data.search.fullText.records} />
    </Container>
  );
}
