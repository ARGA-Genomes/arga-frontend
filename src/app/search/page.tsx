'use client';

import { gql, useQuery } from '@apollo/client';

import { Text, Paper, Title, Box, Grid, Container, SegmentedControl, Center, Avatar, Image, TextInput, createStyles, Stack, Button, LoadingOverlay } from "@mantine/core";
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search as IconSearch } from 'tabler-icons-react';
import SpeciesSearch from '../components/species-search';

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
query FullTextSearch ($query: String, $dataType: String) {
  search {
    fullText (query: $query, dataType: $dataType) {
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
        <SearchItem item={record} key={`${record.scientificName}-${record.type}`} />
      ))}
    </Box>
  )
}


interface SearchProperties {
  onSearch: (searchTerms: string, dataType: string) => void,
}

function Search(props: SearchProperties) {
  const segmented = useSearchTypeStyles();
  const searchParams = useSearchParams();

  const [searchTerms, setSearchTerms] = useState(searchParams.get('q') || "")
  const [dataType, setDataType] = useState(searchParams.get('type') || "all")

  function onFilter(value: string) {
      /* router.push(`/search?q=${encodeURIComponent(search)}&type=${value}`) */
    setDataType(value)
    props.onSearch(searchTerms, value)
  }

  function onSearch(value: string) {
    setSearchTerms(value)
    props.onSearch(value, dataType)
  }

  return (
    <Paper p={20} radius="xl">
      <SegmentedControl
        size="lg"
        fullWidth
        value={dataType}
        onChange={onFilter}
        classNames={segmented.classes}
        data={[
          { value: 'all', label: "All" },
          { value: 'species', label: "Species" },
          { value: 'whole_genomes', label: "Whole Genomes" },
          { value: 'barcodes', label: "Barcodes" },
        ]}
      />

      <Stack mt={20}>
        <Grid align="center">
          <Grid.Col span="auto">
            <SpeciesSearch searchTerms={searchTerms} onSearch={onSearch} />
          </Grid.Col>

          <Grid.Col span="content">
            <Button size="xl" radius="lg" color="midnight.5">Search</Button>
          </Grid.Col>
        </Grid>
      </Stack>
    </Paper>
  )
}


export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || "")
  const [dataType, setDataType] = useState(searchParams.get('type') || "all")

  const { loading, error, data, refetch } = useQuery<QueryResults>(SEARCH_FULLTEXT, {
    variables: {
      query,
      dataType: dataType,
    }
  });

  function onSearch(searchTerms: string, dataType: string) {
      /* router.push(`/search?q=${encodeURIComponent(searchTerms)}&type=${dataType}`, { shallow: true }) */
    setQuery(searchTerms)
    setDataType(dataType)
    refetch({ variables: { query, dataType }})
  }

  return (
    <Container>
      <Search onSearch={onSearch} />

      <Paper bg="midnight.6" radius="xl" p="xl" mt={40}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <Title color="white" align='center'>Search results</Title>
        <SearchResults results={data?.search.fullText.records || []} />
      </Paper>
    </Container>
  );
}


// Custom segmented control style for the search block
const useSearchTypeStyles = createStyles((theme, _params, _getRef) => {
  return {
    root: {
      color: "white",
      backgroundColor: "white",
      paddingLeft: 0,
      paddingRight: 0,
      borderWidth: 0,
      borderRadius: 0,
      borderBottomColor: "grey",
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
    },
    label: {
      fontSize: "20px",
      fontWeight: 400,
      color: "grey",
    },
    control: {
      borderWidth: 0,
      borderRadius: 0,
    },
    active: {
      bottom: 0,
      borderRadius: 0,
      borderBottomColor: theme.colors.bushfire[4],
      borderBottomWidth: "6px",
      borderBottomStyle: "solid",
      boxShadow: "none",
    },
  }
});
