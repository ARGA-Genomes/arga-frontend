'use client';

import { gql, useQuery } from '@apollo/client';

import { Text, Paper, Box, Grid, SegmentedControl, createStyles, Button, LoadingOverlay, Group, Center, TextInput, MantineProvider, Accordion, Divider, Stack, useMantineTheme, Flex } from "@mantine/core";
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search as IconSearch } from "tabler-icons-react";
import { argaBrandLight } from '../theme';

type Classification = {
  kingdom?: string,
  phylum?: string,
  class?: string,
  order?: string,
  family?: string,
  genus?: string,
}

type AssemblySummary = {
  referenceGenomes: number,
  wholeGenomes: number,
  partialGenomes: number,
  barcodes: number,
}

type Record = {
  type: string,
  scientificName: string,
  scientificNameAuthorship: string,
  canonicalName?: string,
  rank?: string,
  taxonomicStatus?: string,
  commonNames?: string[],
  subspecies?: string[],
  synonyms?: string[],
  undescribedSpecies?: string[],
  score: number,
  classification?: Classification,
  assemblySummary?: AssemblySummary,

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
          commonNames
          subspecies
          synonyms
          score
          classification {
            kingdom
            phylum
            class
            order
            family
            genus
          }
          assemblySummary {
            referenceGenomes
            wholeGenomes
            partialGenomes
            barcodes
          }
        }
        ... on GenusItem {
          type
          scientificNameAuthorship
          canonicalName
          undescribedSpecies
          score
          classification {
            kingdom
            phylum
            class
            order
            family
            genus
          }
          assemblySummary {
            referenceGenomes
            wholeGenomes
            partialGenomes
            barcodes
          }
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


function TaxonItem({ item }: { item: Record }) {
  const itemLinkName = item.canonicalName?.replaceAll(" ", "_");

  return (
    <Accordion.Item p={10} value={item.scientificName} sx={{ border: "1px solid #b5b5b5" }}>
      <Accordion.Control>
        <Group position="apart">
          <Stack spacing={0}>
            <Link href={`/species/${itemLinkName}/summary`}>
              <Text size="lg"><i>{item.canonicalName || item.scientificName}</i></Text>
            </Link>
            { item.subspecies?.map(subspecies => (
              <Text size="sm" ml={5} key={subspecies}>
                <Link href={`/species/${itemLinkName}/summary`}>
                  {subspecies}
                </Link>
              </Text>
            )) }
            { item.synonyms?.map(synonym => (
              <Text size="sm" ml={5} key={synonym}>
                  {synonym}
              </Text>
            )) }
          </Stack>
          <Group>
            { item.assemblySummary ? <TaxonSummary summary={item.assemblySummary} /> : null }
          </Group>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <TaxonDetails item={item} />
      </Accordion.Panel>
    </Accordion.Item>
  )
}

function GenusItem({ item }: { item: Record }) {
  return (
    <Accordion.Item p={10} value={item.canonicalName || item.scientificName} sx={{ border: "1px solid #b5b5b5" }}>
      <Accordion.Control>
        <Group position="apart">
          <Stack spacing={0}>
            <Link href={`/genus/${item.canonicalName}`}>
              <Text size="lg"><i>{item.canonicalName || item.scientificName}</i></Text>
            </Link>
            { item.undescribedSpecies?.map(undescribed => (
              <Text size="sm" ml={5} key={undescribed}>
                <Link href={`/species/${undescribed.replaceAll(" ", "_")}/summary`}>
                  {undescribed}
                </Link>
              </Text>
            )) }
          </Stack>
          <Group>
            { item.assemblySummary ? <TaxonSummary summary={item.assemblySummary} /> : null }
          </Group>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <TaxonDetails item={item} />
      </Accordion.Panel>
    </Accordion.Item>
  )
}

function Summary({ label, count }: { label: string, count: number }) {
  return (
    <>
      <Text size="lg">{label} <strong>{count}</strong></Text>
      <Divider size="sm" orientation="vertical" />
    </>
  )
}

function TaxonSummary({ summary }: { summary: AssemblySummary }) {
  return (
    <>
      { summary.wholeGenomes ? <Summary label="Whole genomes" count={summary.wholeGenomes} /> : null }
      { summary.referenceGenomes ? <Summary label="Reference genomes" count={summary.referenceGenomes} /> : null }
      { summary.partialGenomes ? <Summary label="Partial genomes" count={summary.partialGenomes} /> : null }
      { summary.barcodes ? <Summary label="Genetic loci**" count={summary.barcodes} /> : null }
    </>
  )
}

function TaxonDetails({ item }: { item: Record }) {
  const theme = useMantineTheme();

  return (
    <Box>
      <Stack spacing={0} mt={10} mb={30}>
        <Text size="sm">Common names</Text>
        { item.commonNames && item.commonNames.length > 0
        ? <Text size="lg" weight={550}>{item.commonNames?.join(", ")}</Text>
        : <Text size="lg" weight={550} c="dimmed">None</Text>
        }
      </Stack>

      <Stack pl={16} sx={{
        borderLeftWidth: 5,
        borderLeftStyle: "solid",
        borderLeftColor: theme.colors.bushfire[4],
      }}>
        <Text size="lg" weight={550}>Scientific classification</Text>
        <Flex gap="lg">
          <Classification label="Kingdom" value={item.classification?.kingdom} />
          <Classification label="Phylum" value={item.classification?.phylum} />
          <Classification label="Class" value={item.classification?.class} />
          <Classification label="Order" value={item.classification?.order} />
          <Classification label="Family" value={item.classification?.family} />
          <Classification label="Genus" value={item.classification?.genus} />
        </Flex>
      </Stack>
    </Box>
  )
}

function Classification({ label, value }: { label: string, value: string | undefined }) {
  value ||= "Not specified";

  return (
    <Stack spacing={0}>
      <Text size="sm">{label}</Text>
      <Link href="#">
        <Paper py={5} px={15} bg="#f5f5f5" radius="md">
          <Text size="lg" color="midnight.5">{label == "Genus" ? <i>{value}</i> : value}</Text>
        </Paper>
      </Link>
    </Stack>
  )
}

function ReferenceGenomeSequenceItem({ item } : { item: Record }) {
  const itemLinkName = item.scientificName.replaceAll(" ", "_");

  return (
    <Accordion.Item p={10} value={item.scientificName} sx={{ border: "1px solid #b5b5b5" }}>
      <Accordion.Control>
        <Group position="apart">
          <Link href={`/species/${itemLinkName}/whole_genome`}>
            <Text size="lg"><i>{item.canonicalName || item.scientificName}</i></Text>
          </Link>
          <Group>
            <Text size="lg">Reference genomes <strong>{item.sequences}</strong></Text>
          </Group>
        </Group>
      </Accordion.Control>
    </Accordion.Item>
  )
}

function WholeGenomeSequenceItem({ item } : { item: Record }) {
  const itemLinkName = item.scientificName.replaceAll(" ", "_");

  return (
    <Accordion.Item p={10} value={item.scientificName} sx={{ border: "1px solid #b5b5b5" }}>
      <Accordion.Control>
        <Group position="apart">
          <Link href={`/species/${itemLinkName}/whole_genome`}>
            <Text size="lg"><i>{item.canonicalName || item.scientificName}</i></Text>
          </Link>
          <Group>
            <Text size="lg">Whole genomes <strong>{item.sequences}</strong></Text>
          </Group>
        </Group>
      </Accordion.Control>
    </Accordion.Item>
  )
}

function PartialGenomeSequenceItem({ item } : { item: Record }) {
  const itemLinkName = item.scientificName.replaceAll(" ", "_");

  return (
    <Accordion.Item p={10} value={item.scientificName} sx={{ border: "1px solid #b5b5b5" }}>
      <Accordion.Control>
        <Group position="apart">
          <Link href={`/species/${itemLinkName}/whole_genome`}>
            <Text size="lg"><i>{item.canonicalName || item.scientificName}</i></Text>
          </Link>
          <Group>
            <Text size="lg">Partial genomes <strong>{item.sequences}</strong></Text>
          </Group>
        </Group>
      </Accordion.Control>
    </Accordion.Item>
  )
}

function UnknownGenomeSequenceItem({ item } : { item: Record }) {
  const itemLinkName = item.scientificName.replaceAll(" ", "_");

  return (
    <Accordion.Item p={10} value={item.scientificName} sx={{ border: "1px solid #b5b5b5" }}>
      <Accordion.Control>
        <Group position="apart">
          <Link href={`/species/${itemLinkName}/whole_genome`}>
            <Text size="lg"><i>{item.canonicalName || item.scientificName}</i></Text>
          </Link>
          <Group>
            <Text size="lg">Other genomes <strong>{item.sequences}</strong></Text>
          </Group>
        </Group>
      </Accordion.Control>
    </Accordion.Item>
  )
}

function BarcodeItem({ item } : { item: Record }) {
  const itemLinkName = item.scientificName.replaceAll(" ", "_");

  return (
    <Accordion.Item p={10} value={item.scientificName} sx={{ border: "1px solid #b5b5b5" }}>
      <Accordion.Control>
        <Group position="apart">
          <Link href={`/species/${itemLinkName}/barcode`}>
            <Text size="lg"><i>{item.canonicalName || item.scientificName}</i></Text>
          </Link>
          <Group>
            <Text size="lg">Genetic loci* <strong>{item.sequences}</strong></Text>
          </Group>
        </Group>
      </Accordion.Control>
    </Accordion.Item>
  )
}


function SearchItem({ item } : { item: Record }) {
  switch (item.type) {
      case 'TAXON':
        return (<TaxonItem item={item} />)
      case 'GENUS':
        return (<GenusItem item={item} />)
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
    <Accordion variant="separated" radius="lg" multiple>
      {results.map(record => (
        <SearchItem item={record} key={`${record.scientificName}-${record.type}`} />
      ))}
    </Accordion>
  )
}


interface SearchProperties {
  onSearch: (searchTerms: string, dataType: string) => void,
}

function SearchDataTypeItem({ label }: { label: string }) {
  return (
    <Center m={10}>
      <Text>{label}</Text>
    </Center>
  )
}

function Search(props: SearchProperties) {
  const segmented = useSearchTypeStyles();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get('q') || "")
  const [searchTerms, setSearchTerms] = useState(searchParams.get('q') || "")
  const [dataType, setDataType] = useState(searchParams.get('type') || "all")

  function onFilter(value: string) {
    setDataType(value)
    props.onSearch(searchTerms, value)
  }

  function onSearch(value: string) {
    setSearchTerms(value)
    props.onSearch(value, dataType)
  }

  return (
    <Box>
      <form onSubmit={(ev) => { ev.preventDefault(); onSearch(value) }}>
        <Grid align="center" m={20}>
          <Grid.Col span="auto">
            <TextInput
              placeholder="e.g. sequence accession, taxon identifier, genus name"
              value={value}
              onChange={val => setValue(val.target.value)}
              iconWidth={60}
              size="xl"
              radius={16}
              icon={<IconSearch size={28} />}
            />
          </Grid.Col>

          <Grid.Col span="content">
            <Button size="xl" className="primary_button" type="submit">Search</Button>
          </Grid.Col>
        </Grid>
      </form>

      <SegmentedControl
        size="lg"
        fullWidth
        value={dataType}
        onChange={onFilter}
        classNames={segmented.classes}
        data={[
          { value: 'all', label: "All" },
          { value: 'species', label: <SearchDataTypeItem label="Taxonomy" /> },
          { value: 'whole_genomes', label: <SearchDataTypeItem label="Genome assemblies" /> },
          { value: 'barcodes', label: <SearchDataTypeItem label="Genetic loci*" /> }
        ]}
      />
    </Box>
  )
}


export default function SearchPage() {
  const theme = useMantineTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || "")
  const [dataType, setDataType] = useState(searchParams.get('type') || "all")

  const { loading, error, data } = useQuery<QueryResults>(SEARCH_FULLTEXT, {
    variables: {
      query,
      dataType: dataType,
    }
  });

  function onSearch(searchTerms: string, dataType: string) {
    setQuery(searchTerms)
    setDataType(dataType)
    router.push(`/search?q=${encodeURIComponent(searchTerms)}&type=${dataType}`)
  }

  return (
    <MantineProvider inherit withGlobalStyles withNormalizeCSS theme={argaBrandLight}>
    <Box>
      <Search onSearch={onSearch} />

      <Paper radius="xl" p="xl" mt={40} sx={{ border: "1px solid #dbdbdb" }} pos="relative">
        <LoadingOverlay
          overlayColor={theme.colors.midnight[0]}
          transitionDuration={500}
          loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
          visible={loading}
          radius="xl"
        />
        <Text size="lg" ml={20} mb={30}>
          { !loading && data
            ? (<><strong>{data?.search.fullText.records.length} </strong> search results found for <strong>{query} </strong></>)
            : null
          }
        </Text>
        <SearchResults results={data?.search.fullText.records || []} />
      </Paper>
    </Box>
    </MantineProvider>
  );
}


// Custom segmented control style for the search block
const useSearchTypeStyles = createStyles((theme, _params, _getRef) => {
  return {
    root: {
      backgroundColor: "#f0f0f0",
      paddingLeft: 0,
      paddingRight: 0,
      borderWidth: 0,
      borderRadius: 0,
    },
    label: {
      fontWeight: 400,
      color: theme.colors.midnight[5],
    },
    control: {
      borderWidth: 0,
    },
    active: {
      backgroundColor: theme.colors.wheat[0],
      borderWidth: 0,
      borderRadius: 10,
      boxShadow: "none",
    },
  }
});
