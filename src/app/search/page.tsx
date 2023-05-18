'use client';

import { gql, useQuery } from '@apollo/client';

import { Text, Paper, Title, Box, Grid, Container, SegmentedControl, Center, Space, Avatar, Image } from "@mantine/core";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Record = {
  type: string,
  scientificName: string,
  scientificNameAuthorship: string,
  canonicalName?: string,
  rank?: string,
  taxonomicStatus?: string,
  commonNames?: string[],
  score: number,

  sequences?: number,
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
          type
          scientificName
          scientificNameAuthorship
          canonicalName
          rank
          taxonomicStatus
          commonNames
          score
        }
        ... on GenomeSequenceItem {
          type
          scientificName
          sequences
          score
        }
      }
    }
  }
}`


function TaxonItem({ item } : { item: Record }) {
  const itemLinkName = item.canonicalName?.replaceAll(" ", "_");

  return (
    <Link href={`/species/${itemLinkName}`}>
    <Paper my={30} p={10} radius="lg">
      <Grid>
        <Grid.Col span="content">
          <Avatar color="bushfire.5" size="lg" radius="lg" variant="filled">
            <Image src="/search-icons/taxon.svg" alt="Taxon dashboard" m={5} />
          </Avatar>
        </Grid.Col>
        <Grid.Col span="auto">
          <Text><i>{item.canonicalName || item.scientificName}</i> {item.scientificNameAuthorship}</Text>
          <Text c="dimmed">{item.commonNames?.join(", ")}</Text>
        </Grid.Col>
      </Grid>
    </Paper>
    </Link>
  )
}

function ReferenceGenomeSequenceItem({ item } : { item: Record }) {
  const itemLinkName = item.scientificName.replaceAll(" ", "_");

  return (
    <Link href={`/species/${itemLinkName}`}>
    <Paper my={30} p={10} radius="lg">
      <Grid>
        <Grid.Col span="content">
          <Avatar color="shellfish.4" size="lg" radius="lg" variant="filled">
            <Image src="/search-icons/wgs.svg" alt="Reference Genome Sequence" m={5} />
          </Avatar>
        </Grid.Col>
        <Grid.Col span="auto">
          <Text><i>{item.scientificName}</i></Text>
          <Text c="dimmed"><strong>{item.sequences || 0} Reference genome{(item.sequences || 0) > 1 ? "s" : null} found</strong></Text>
        </Grid.Col>
      </Grid>
    </Paper>
    </Link>
  )
}

function WholeGenomeSequenceItem({ item } : { item: Record }) {
  const itemLinkName = item.scientificName.replaceAll(" ", "_");

  return (
    <Link href={`/species/${itemLinkName}`}>
    <Paper my={30} p={10} radius="lg">
      <Grid>
        <Grid.Col span="content">
          <Avatar color="shellfish.3" size="lg" radius="lg" variant="filled">
            <Image src="/search-icons/wgs.svg" alt="Whole Genome Sequence" m={5} />
          </Avatar>
        </Grid.Col>
        <Grid.Col span="auto">
          <Text><i>{item.scientificName}</i></Text>
          <Text c="dimmed"><strong>{item.sequences || 0}</strong> Whole genome{(item.sequences || 0) > 1 ? "s" : null} found</Text>
        </Grid.Col>
      </Grid>
    </Paper>
    </Link>
  )
}

function PartialGenomeSequenceItem({ item } : { item: Record }) {
  const itemLinkName = item.scientificName.replaceAll(" ", "_");

  return (
    <Link href={`/species/${itemLinkName}`}>
    <Paper my={30} p={10} radius="lg">
      <Grid>
        <Grid.Col span="content">
          <Avatar color="shellfish.1" size="lg" radius="lg" variant="filled">
            <Image src="/search-icons/partial.svg" alt="Partial Genome Sequence" m={5} />
          </Avatar>
        </Grid.Col>
        <Grid.Col span="auto">
          <Text><i>{item.scientificName}</i></Text>
          <Text c="dimmed"><strong>{item.sequences || 0}</strong> Partial genome{(item.sequences || 0) > 1 ? "s" : null} found</Text>
        </Grid.Col>
      </Grid>
    </Paper>
    </Link>
  )
}

function UnknownGenomeSequenceItem({ item } : { item: Record }) {
  const itemLinkName = item.scientificName.replaceAll(" ", "_");

  return (
    <Link href={`/species/${itemLinkName}`}>
    <Paper my={30} p={10} radius="lg">
      <Grid>
        <Grid.Col span="content">
          <Avatar color="shellfish.1" size="lg" radius="lg" variant="filled">
            <Image src="/search-icons/partial.svg" alt="Sequence" m={5} />
          </Avatar>
        </Grid.Col>
        <Grid.Col span="auto">
          <Text><i>{item.scientificName}</i></Text>
          <Text c="dimmed"><strong>{item.sequences || 0}</strong> Sequence{(item.sequences || 0) > 1 ? "s" : null} found</Text>
        </Grid.Col>
      </Grid>
    </Paper>
    </Link>
  )
}

function BarcodeItem({ item } : { item: Record }) {
  const itemLinkName = item.scientificName.replaceAll(" ", "_");

  return (
    <Link href={`/species/${itemLinkName}`}>
    <Paper my={30} p={10} radius="lg">
      <Grid>
        <Grid.Col span="content">
          <Avatar color="moss.4" size="lg" radius="lg" variant="filled">
            <Image src="/search-icons/barcode.svg" alt="Barcode" m={10} />
          </Avatar>
        </Grid.Col>
        <Grid.Col span="auto">
          <Text><i>{item.scientificName}</i></Text>
          <Text c="dimmed"><strong>{item.sequences || 0}</strong> Barcode{(item.sequences || 0) > 1 ? "s" : null} found</Text>
        </Grid.Col>
      </Grid>
    </Paper>
    </Link>
  )
}


function SearchItem({ item } : { item: Record }) {
  switch (item.type) {
      case 'TAXON':
        return (<TaxonItem item={item} />)
      case 'REFERENCE_GENOME_SEQUENCE':
        return (<ReferenceGenomeSequenceItem item={item} />)
      case 'WHOLE_GENOME_SEQUENCE':
        return (<WholeGenomeSequenceItem item={item} />)
      case 'PARTIAL_GENOME_SEQUENCE':
        return (<PartialGenomeSequenceItem item={item} />)
      case 'UNKNOWN_GENOME_SEQUENCE':
        return (<UnknownGenomeSequenceItem item={item} />)
      case 'BARCODE':
        return (<BarcodeItem item={item} />)
      default:
        return null
  }
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
