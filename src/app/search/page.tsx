'use client';

import { gql, useQuery } from '@apollo/client';

import {
  Text,
  Paper,
  Box,
  Grid,
  Image,
  Group,
  TextInput,
  Stack,
  Container,
  Button,
  SimpleGrid
} from "@mantine/core";
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Eye, Search as IconSearch } from "tabler-icons-react";
import { MAX_WIDTH } from '../constants';
import { LoadPanel } from '@/components/load-overlay';
import { FilterBar } from '@/components/filtering/filter-bar';
import { PaginationBar } from '@/components/pagination';
import { Attribute, AttributePill, DataField } from '@/components/data-fields';
import { HighlightStack } from '@/components/highlight-stack';
import { usePreviousPage } from '@/components/navigation-history';
import { useHover } from '@mantine/hooks';

type Classification = {
  kingdom?: string,
  phylum?: string,
  class?: string,
  order?: string,
  family?: string,
  genus?: string,
}

type DataSummary = {
  referenceGenomes: number,
  wholeGenomes: number,
  partialGenomes: number,
  barcodes: number,
}

type Item = {
  type: string,
  score: number,
  status: string,
  canonicalName: string,
  subspecies?: string[],
  synonyms?: string[],
  commonNames?: string[],
  classification?: Classification,
  dataSummary: DataSummary,

  accession?: string,
  genomeRep?: string,
  dataSource?: string,
  level?: string,
  referenceGenome?: boolean,
  releaseDate?: string,

  locusType?: string,
  voucherStatus?: string,
  eventDate?: string,
  eventLocation?: string,

  institutionCode?: string,
  collectionCode?: string,
  recordedBy?: string,
  identifiedBy?: string,
};

type FullTextResults = {
  records: Item[],
  total: number
}

type SearchResults = {
  fullText: FullTextResults,
};

type QueryResults = {
  search: SearchResults,
};

const PAGE_SIZE = 10;

const SEARCH_FULLTEXT = gql`
query FullTextSearch ($query: String, $dataType: String, $pagination: Pagination,) {
  search {
    fullText (query: $query, dataType: $dataType, pagination: $pagination,) {
      total
      records {
        ... on TaxonItem {
          type
          status
          score
          canonicalName
          subspecies
          synonyms
          commonNames
          classification {
            kingdom
            phylum
            class
            order
            family
            genus
          }
          dataSummary {
            referenceGenomes
            wholeGenomes
            partialGenomes
            barcodes
          }
        }
        ... on GenomeItem {
          type
          status
          score
          canonicalName
          accession
          genomeRep
          dataSource
          level
          referenceGenome
          releaseDate
        }
        ... on LocusItem {
          type
          status
          score
          canonicalName
          accession
          locusType
          dataSource
          voucherStatus
          eventDate
          eventLocation
        }
        ... on SpecimenItem {
          type
          status
          score
          canonicalName
          accession
          dataSource
          institutionCode
          collectionCode
          recordedBy
          identifiedBy
          eventDate
          eventLocation
        }
      }
    }
  }
}`


function TaxonItem({ item }: { item: Item }) {
  const itemLinkName = item.canonicalName?.replaceAll(" ", "_");
  const { hovered, ref } = useHover();

  return (
    <Paper radius="lg" withBorder style={{ border: 'solid 1px var(--mantine-color-moss-4)' }} ref={ref} bg={hovered ? "#96bb5c22" : undefined}>
      <Grid gutter="xl">
        <Grid.Col span="content">
          <Paper bg="moss.4" w={180} style={{ borderRadius: 'var(--mantine-radius-lg) 0 0 var(--mantine-radius-lg)', border: 'none' }}>
            <Group gap="xs" wrap="nowrap">
              <Image src={"card-icons/type/species_report.svg"} fit="contain" h={80} w="auto" alt="" />
              <Text c="white" fw={600} fz="md" mb="sm" style={{ alignSelf: "end", lineHeight: "normal" }}>Species Report</Text>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={2} my="auto">
          <Attribute label="Accepted species name">
            <Stack gap={0} justify='center'>
              <Text ml="sm" size="sm" fw={550} fs="italic">{item.canonicalName}</Text>
              <Text ml="sm" fz="sm" c="dimmed">
                {item.synonyms ? `syn. ${item.synonyms[0]}` : null}
              </Text>
            </Stack>
          </Attribute>
        </Grid.Col>

        <Grid.Col span="auto" my="auto">
          <TaxonDetails item={item} />
        </Grid.Col>

        <Grid.Col span={2} my="auto">
          <HighlightStack>
            <TaxonSummary data={item.dataSummary} />
          </HighlightStack>
        </Grid.Col>

        <Grid.Col span="content">
          <Link href={`/species/${itemLinkName}`}>
            <Button h="100%" bg="midnight" style={{ borderRadius: '0 var(--mantine-radius-lg) var(--mantine-radius-lg) 0' }}>
              <Stack gap={3} align='center'>
                <Eye />
                <Text fw={600}>view</Text>
              </Stack>
            </Button>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

function TaxonSummary({ data }: { data: DataSummary }) {
  const genomes = data.partialGenomes + data.referenceGenomes + data.wholeGenomes;

  return (
    <SimpleGrid cols={2}>
      <AttributePill label="Genomes" color={genomes ? "moss.3" : "bushfire.2"} value={genomes} />
      <AttributePill label="Genetic Loci" color={data.barcodes ? "moss.3" : "bushfire.2"} value={data.barcodes} />
    </SimpleGrid>
  )
}

function TaxonDetails({ item }: { item: Item }) {
  const taxon = item.classification;
  if (!taxon) return null;

  return (
    <SimpleGrid cols={6}>
      <AttributePill label="Kingdom" value={taxon.kingdom} href={`/kingdom/${taxon.kingdom}`} />
      <AttributePill label="Phylum" value={taxon.phylum} href={`/phylum/${taxon.phylum}`} />
      <AttributePill label="Class" value={taxon.class} href={`/class/${taxon.class}`} />
      <AttributePill label="Order" value={taxon.order} href={`/order/${taxon.order}`} />
      <AttributePill label="Family" value={taxon.family} href={`/family/${taxon.family}`} />
      <AttributePill label="Genus" value={taxon.genus} href={`/genus/${taxon.genus}`} italic />
    </SimpleGrid>
  )
}


function GenomeItem({ item }: { item: Item }) {
  const itemLinkName = item.canonicalName?.replaceAll(" ", "_");
  const { hovered, ref } = useHover();

  return (
    <Paper radius="lg" withBorder style={{ border: 'solid 1px #f47c2e' }} ref={ref} bg={hovered ? "#f47c2e22" : undefined}>
      <Grid gutter="xl">
        <Grid.Col span="content">
          <Paper bg="#f47c2e" w={180} style={{ borderRadius: 'var(--mantine-radius-lg) 0 0 var(--mantine-radius-lg)', border: 'none' }}>
            <Group gap="xs" wrap="nowrap">
              <Image src={"card-icons/type/whole_genomes.svg"} fit="contain" h={80} w="auto" alt="" />
              <Text c="white" fw={600} fz="md" mb="sm" style={{ alignSelf: "end", lineHeight: "normal" }}>Whole Genome</Text>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={2} my="auto">
          <Attribute label="Accepted species name">
            <Text ml="sm" size="sm" fw={550} fs="italic">{item.canonicalName}</Text>
          </Attribute>
        </Grid.Col>

        <Grid.Col span="auto" my="auto">
          <GenomeDetails item={item} />
        </Grid.Col>

        <Grid.Col span={2} my="auto">
          <GenomeSummary item={item} />
        </Grid.Col>

        <Grid.Col span="content">
          <Link href={`/species/${itemLinkName}/whole_genomes/${item.accession}`}>
            <Button h="100%" bg="midnight" style={{ borderRadius: '0 var(--mantine-radius-lg) var(--mantine-radius-lg) 0' }}>
              <Stack gap={3} align='center'>
                <Eye />
                <Text fw={600}>view</Text>
              </Stack>
            </Button>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

function GenomeSummary({ item }: { item: Item }) {
  return (
    <SimpleGrid cols={2}>
      <Attribute label="Data source"><DataField value={item.dataSource}/></Attribute>
      <Attribute label="Release date"><DataField value={item.releaseDate}/></Attribute>
    </SimpleGrid>
  )
}

function GenomeDetails({ item }: { item: Item }) {
  return (
    <SimpleGrid cols={4}>
      <Attribute label="Accession"><DataField value={item.accession}/></Attribute>
      <AttributePill label="Representation" value={item.dataSource} />
      <AttributePill label="Assembly type" value={item.level} />
      <AttributePill label="Assembly level" value={item.level} />
    </SimpleGrid>
  )
}

function LocusItem({ item }: { item: Item }) {
  const itemLinkName = item.canonicalName?.replaceAll(" ", "_");
  const { hovered, ref } = useHover();

  return (
    <Paper radius="lg" withBorder style={{ border: 'solid 1px #58a39d' }} ref={ref} bg={hovered ? "#58a39d22" : undefined}>
      <Grid gutter="xl">
        <Grid.Col span="content">
          <Paper bg="#58a39d" w={180} style={{ borderRadius: 'var(--mantine-radius-lg) 0 0 var(--mantine-radius-lg)', border: 'none' }}>
            <Group gap="xs" wrap="nowrap">
              <Image src={"card-icons/type/markers.svg"} fit="contain" h={80} w="auto" alt="" />
              <Text c="white" fw={600} fz="md" mb="sm" style={{ alignSelf: "end", lineHeight: "normal" }}>Locus</Text>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={2} my="auto">
          <Attribute label="Accepted species name">
            <Text ml="sm" size="sm" fw={550} fs="italic">{item.canonicalName}</Text>
          </Attribute>
        </Grid.Col>

        <Grid.Col span="auto" my="auto">
          <LocusDetails item={item} />
        </Grid.Col>

        <Grid.Col span={2} my="auto">
          <LocusSummary item={item} />
        </Grid.Col>

        <Grid.Col span="content">
          <Link href={`/species/${itemLinkName}/markers/${item.accession}`}>
            <Button h="100%" bg="midnight" style={{ borderRadius: '0 var(--mantine-radius-lg) var(--mantine-radius-lg) 0' }}>
              <Stack gap={3} align='center'>
                <Eye />
                <Text fw={600}>view</Text>
              </Stack>
            </Button>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

function LocusSummary({ item }: { item: Item }) {
  return (
    <SimpleGrid cols={2}>
      <Attribute label="Data source"><DataField value={item.dataSource}/></Attribute>
      <Attribute label="Release date"><DataField value={item.eventDate}/></Attribute>
    </SimpleGrid>
  )
}

function LocusDetails({ item }: { item: Item }) {
  return (
    <SimpleGrid cols={4}>
      <AttributePill label="Accession" value={item.accession} />
      <AttributePill label="Gene name" value={item.locusType} />
      <AttributePill label="Sequence length" />
      <AttributePill label="Source molecule" />
    </SimpleGrid>
  )
}


function SpecimenItem({ item }: { item: Item }) {
  const itemLinkName = item.canonicalName?.replaceAll(" ", "_");
  const { hovered, ref } = useHover();

  return (
    <Paper radius="lg" withBorder style={{ border: 'solid 1px #f47c2e' }} ref={ref} bg={hovered ? "#f47c2e22" : undefined}>
      <Grid gutter="xl">
        <Grid.Col span="content">
          <Paper bg="#f47c2e" w={180} style={{ borderRadius: 'var(--mantine-radius-lg) 0 0 var(--mantine-radius-lg)', border: 'none' }}>
            <Group gap="xs" wrap="nowrap">
              <Image src={"card-icons/type/specimens.svg"} fit="contain" h={80} w="auto" alt="" />
              <Text c="white" fw={600} fz="md" mb="sm" style={{ alignSelf: "end", lineHeight: "normal" }}>Specimen</Text>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={2} my="auto">
          <Attribute label="Accepted species name">
            <Text ml="sm" size="sm" fw={550} fs="italic">{item.canonicalName}</Text>
          </Attribute>
        </Grid.Col>

        <Grid.Col span="auto" my="auto">
          <SpecimenDetails item={item} />
        </Grid.Col>

        <Grid.Col span={2} my="auto">
          <SpecimenSummary item={item} />
        </Grid.Col>

        <Grid.Col span="content">
          <Link href={`/species/${itemLinkName}/markers/${item.accession}`}>
            <Button h="100%" bg="midnight" style={{ borderRadius: '0 var(--mantine-radius-lg) var(--mantine-radius-lg) 0' }}>
              <Stack gap={3} align='center'>
                <Eye />
                <Text fw={600}>view</Text>
              </Stack>
            </Button>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

function SpecimenSummary({ item }: { item: Item }) {
  return (
    <SimpleGrid cols={2}>
      <Attribute label="Data source"><DataField value={item.dataSource}/></Attribute>
      <Attribute label="Collected date"><DataField value={item.eventDate}/></Attribute>
    </SimpleGrid>
  )
}

function SpecimenDetails({ item }: { item: Item }) {
  return (
    <SimpleGrid cols={4}>
      <AttributePill label="Accession" value={item.accession} />
      <AttributePill label="Institution" value={item.institutionCode} />
      <AttributePill label="Collection" value={item.collectionCode} />
      <AttributePill label="Collected by" value={item.recordedBy} />
    </SimpleGrid>
  )
}


function SearchItem({ item }: { item: Item }) {
  switch (item.type) {
    case 'TAXON':
      return (<TaxonItem item={item} />)
    case 'GENOME':
      return (<GenomeItem item={item} />)
    case 'LOCUS':
      return (<LocusItem item={item} />)
    case 'SPECIMEN':
      return (<SpecimenItem item={item} />)
    default:
      return null
  }
}

function SearchResults({ results }: { results: Item[] }) {
  return (
    <Stack gap="xs">
      {results.map(record => (
        <SearchItem item={record} key={`${record.canonicalName}-${record.type}`} />
      ))}
    </Stack>
  )
}


interface SearchProperties {
  onSearch: (searchTerms: string, dataType: string) => void,
  data: QueryResults | undefined,
  loading: boolean
}

function Search(props: SearchProperties) {
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
    <Paper bg="midnight.1" p={10} radius={0}>
      <Box>
        <form onSubmit={(ev) => { ev.preventDefault(); onSearch(value) }}>
          <Grid align="center" m={10}>
            <Grid.Col span={7}>
              <TextInput
                placeholder="e.g. sequence accession, taxon identifier, genus name"
                value={value}
                onChange={val => setValue(val.target.value)}
                leftSectionWidth={60}
                size="xl"
                radius={16}
                leftSection={<IconSearch size={28} />}
              />
            </Grid.Col>
          </Grid>
        </form>
      </Box>
    </Paper>
  )
}


export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || "")
  const [dataType, setDataType] = useState(searchParams.get('type') || "all")
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [_, setPreviousPage] = usePreviousPage();

  const { loading, error, data } = useQuery<QueryResults>(SEARCH_FULLTEXT, {
    variables: {
      query: searchParams.get('q'),
      dataType: searchParams.get('type'),
      pagination: { page: Number(searchParams.get('page')), pageSize: PAGE_SIZE }
    }
  });

  useEffect(() => {
    let params = new URLSearchParams(searchParams)
    params.set('q', query);
    params.set('type', dataType);
    params.set('page', page.toString());

    const url = pathname + '?' + params.toString();
    setPreviousPage({ name: 'search results', url });
    router.push(url)
  }, [query, dataType, page, setPreviousPage])

  function onSearch(searchTerms: string, dataType: string) {
    setQuery(searchTerms)
    setDataType(dataType)
    setPage(1)
  }

  if (error) {
    return <Text c="red">{error.message}</Text>
  }

  return (
    <>
      <Search onSearch={onSearch} data={data} loading={loading} />

      <Paper radius={0} py="xl">
        <Container maw={MAX_WIDTH}>
          <LoadPanel visible={loading}>
            <Stack>
              <FilterBar
                filters={[]}
                title={
                  <Group justify="left" gap={5}>
                    <Text fz="lg" fw={700}>{data?.search.fullText.total}</Text>
                    <Text fz="lg">search results found for</Text>
                    <Text fz="lg" fw={600}>{query}</Text>
                  </Group>
                }
              >
              </FilterBar>

              <SearchResults results={data?.search.fullText.records || []} />
              <PaginationBar
                total={data?.search.fullText.total}
                page={page}
                pageSize={PAGE_SIZE}
                onChange={setPage}
              />
            </Stack>
          </LoadPanel>
        </Container>
      </Paper>
    </>
  );
}
