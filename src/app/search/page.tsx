'use client';

import { gql, useQuery } from '@apollo/client';

import {
  Text,
  Paper,
  Box,
  Grid,
  SegmentedControl,
  createStyles,
  Button,
  LoadingOverlay,
  Group,
  Center,
  TextInput,
  MantineProvider,
  Accordion,
  Divider,
  Stack,
  useMantineTheme,
  Flex,
  Pagination
} from "@mantine/core";
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {useEffect, useState} from 'react';
import { CircleCheck, CircleX, Search as IconSearch } from "tabler-icons-react";
import { argaBrandLight } from '../theme';
import ChevronCircleAccordion from 'public/search-icons/chevron-circle-accordion';

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

type Record = {
  type: string,
  score: number,
  status: string,
  canonicalName: string,
  subspecies?: string[],
  synonyms?: string[],
  commonNames?: string[],
  classification?: Classification,
  dataSummary?: DataSummary,

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
};

type FullTextResults = {
  records: Record[],
  total: number
}

type SearchResults = {
  fullText: FullTextResults,
};

type QueryResults = {
  search: SearchResults,
};

const PAGE_SIZE = 20;

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
      }
    }
  }
}`

type Pagination = {
  page: number,
  pageSize: number,
}


function Summary({ label, value }: { label: string, value: number | string | React.ReactNode }) {
  return (
    <>
      <Text size="lg">{label} <strong>{value}</strong></Text>
      <Divider size="sm" orientation="vertical" />
    </>
  )
}

function Attribute({ label, value }: { label: string, value: string | undefined }) {
  value ||= "Not specified";
  const { classes } = useSearchTypeStyles();
  const link = "/" + label.toLowerCase() + "/" + value

  return (
    <Stack spacing={0}>
      <Text size="sm">{label}</Text>
      <Link href={link}>
        <Paper py={5} px={15} radius="md" sx={{maxWidth:'300px'}} className={classes.attribute}>
          <Text size="lg" color="midnight.5">{label == "Genus" ? <i>{value}</i> : value}</Text>
        </Paper>
      </Link>
    </Stack>
  )
}


function TaxonItem({ item }: { item: Record }) {
  const itemLinkName = item.canonicalName?.replaceAll(" ", "_");

  return (
    <Accordion.Item p={10} value={item.canonicalName} sx={{ border: "1px solid #b5b5b5" }}>
      <Accordion.Control>
        <Group position="apart">
          <Stack spacing={0}>
            <Link href={`/species/${itemLinkName}/summary`}>
              <Text size="lg"><i>{item.canonicalName}</i></Text>
            </Link>
            { item.subspecies?.map(subspecies => (
              <Text size="sm" ml={5} key={subspecies} className='subspeciesAccordion'>
                <Link href={`/species/${itemLinkName}/summary`}>
                  {subspecies}
                </Link>
              </Text>
            )) }
            {
              <Text size="sm" ml={5} className="synonymClosed">
                  {item.synonyms? item.synonyms[0]: null}
              </Text>            }
            { item.synonyms?.map(synonym => (
              <Text size="sm" ml={5} key={synonym} className="synonymOpened">
                  {synonym}
              </Text>
            )) }
          </Stack>
          <Group>
            { item.dataSummary ? <TaxonSummary summary={item.dataSummary} /> : null }
          </Group>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <TaxonDetails item={item} />
      </Accordion.Panel>
    </Accordion.Item>
  )
}

function TaxonSummary({ summary }: { summary: DataSummary }) {
  return (
    <>
      { summary.wholeGenomes ? <Summary label="Whole genomes" value={summary.wholeGenomes} /> : null }
      { summary.referenceGenomes ? <Summary label="Reference genomes" value={summary.referenceGenomes} /> : null }
      { summary.partialGenomes ? <Summary label="Partial genomes" value={summary.partialGenomes} /> : null }
      { summary.barcodes ? <Summary label="Genetic loci*" value={summary.barcodes} /> : null }
    </>
  )
}

function TaxonDetails({ item }: { item: Record }) {
  const theme = useMantineTheme();
  const { classes } = useSearchTypeStyles();

  const attributes = <>
    <Attribute label="Kingdom" value={item.classification?.kingdom} />
    <Attribute label="Phylum" value={item.classification?.phylum} />
    <Attribute label="Class" value={item.classification?.class} />
    <Attribute label="Order" value={item.classification?.order} />
    <Attribute label="Family" value={item.classification?.family} />
    <Attribute label="Genus" value={item.classification?.genus} />
  </>

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
      }}
      className={classes.horizontalGrouping}>
        <Text size="lg" weight={550}>Scientific classification</Text>
        <Flex gap="lg" >
          {attributes}
        </Flex>
      </Stack>
      <Stack pl={16} sx={{
        borderLeftWidth: 5,
        borderLeftStyle: "solid",
        borderLeftColor: theme.colors.bushfire[4],
      }}
        className={classes.verticalGrouping}>
        <Text size="lg" weight={550}>Scientific classification</Text>
          {attributes}
      </Stack>
    </Box>
  )
}


function GenomeItem({ item } : { item: Record }) {
  return (
    <Accordion.Item p={10} value={item.accession || ""} sx={{ border: "1px solid #b5b5b5" }}>
      <Accordion.Control>
        <Group position="apart">
          <Link href={`/assemblies/${item.accession}`}>
            <Text size="lg"><i>{item.canonicalName}</i></Text>
          </Link>
          <Group>
            <GenomeSummary item={item} />
          </Group>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <GenomeDetails item={item} />
      </Accordion.Panel>
    </Accordion.Item>
  )
}

function GenomeSummary({ item }: { item: Record }) {
  return (
    <>
      <Summary label="Accession no." value={`${item.accession} (${item.genomeRep})`} />
      <Summary label="Reference genome" value={item.referenceGenome ? <CircleCheck size={20} color="green" /> : <CircleX size={20} color="red" />} />
    </>
  )
}

function GenomeDetails({ item }: { item: Record }) {
  const theme = useMantineTheme();

  return (
    <Box>
      <Stack pl={16} sx={{
        borderLeftWidth: 5,
        borderLeftStyle: "solid",
        borderLeftColor: theme.colors.bushfire[4],
      }}>
        <Text size="lg" weight={550}>Attributes</Text>
        <Flex gap="lg">
          <Attribute label="Data source" value={item.dataSource} />
          <Attribute label="Level" value={item.level} />
          <Attribute label="Released date" value={item.releaseDate} />
        </Flex>
      </Stack>
    </Box>
  )
}

function LocusItem({ item } : { item: Record }) {
  return (
    <Accordion.Item p={10} value={item.canonicalName || ""} sx={{ border: "1px solid #b5b5b5" }}>
      <Accordion.Control>
        <Group position="apart">
          <Link href={`/markers/${item.accession}`}>
            <Text size="lg"><i>{item.canonicalName}</i></Text>
          </Link>
          <Group>
            <LocusSummary item={item} />
          </Group>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <LocusDetails item={item} />
      </Accordion.Panel>
    </Accordion.Item>
  )
}

function LocusSummary({ item }: { item: Record }) {
  return (
    <>
      <Summary label="Accession no." value={item.accession} />
      <Summary label="Source molecule" value={item.locusType} />
    </>
  )
}

function LocusDetails({ item }: { item: Record }) {
  const theme = useMantineTheme();

  return (
    <Box>
      <Stack pl={16} sx={{
        borderLeftWidth: 5,
        borderLeftStyle: "solid",
        borderLeftColor: theme.colors.bushfire[4],
      }}>
        <Text size="lg" weight={550}>Attributes</Text>
        <Flex gap="lg">
          <Attribute label="Data source" value={item.dataSource} />
          <Attribute label="Voucher status" value={item.voucherStatus} />
          <Attribute label="Occurrence date" value={item.eventDate} />
          <Attribute label="Occurrence location" value={item.eventLocation} />
        </Flex>
      </Stack>
    </Box>
  )
}


function SearchItem({ item } : { item: Record }) {
  switch (item.type) {
      case 'TAXON':
        return (<TaxonItem item={item} />)
      case 'GENOME':
        return (<GenomeItem item={item} />)
      case 'LOCUS':
        return (<LocusItem item={item} />)
      default:
        return null
  }
}

function SearchResults({ results } : { results: Record[] }) {
  return (
    <Accordion variant="separated" 
      radius="lg" 
      defaultValue={[results[0] ? results[0].canonicalName: ""]} 
      chevron={ChevronCircleAccordion()}
      multiple>
      {results.map(record => (
        <SearchItem item={record} key={`${record.canonicalName}-${record.type}`} />
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
        <Grid align="center" m={10}>
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
          { value: 'all', label: <SearchDataTypeItem label="All" />},
          { value: 'taxonomy', label: <SearchDataTypeItem label="Taxonomy" /> },
          { value: 'genomes', label: <SearchDataTypeItem label="Genome assemblies" /> },
          { value: 'loci', label: <SearchDataTypeItem label="Genetic loci*" /> }
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
  const [pagination, setPagination] = useState({ page: 1, pageSize: PAGE_SIZE });
  const [totalPages, setTotalPages] = useState(1)

  const { loading, error, data } = useQuery<QueryResults>(SEARCH_FULLTEXT, {
    variables: {
      query,
      dataType: dataType,
      pagination
    }
  });

  useEffect(() => {
    setPagination({ page: 1, pageSize: PAGE_SIZE })
    setTotalPages(1)
  }, [setPagination, setTotalPages])

  useEffect(() => {
    setTotalPages(data ? Math.ceil(data.search.fullText.total / PAGE_SIZE) : 1)
  }, [data, setTotalPages])

  function onSearch(searchTerms: string, dataType: string) {
    setQuery(searchTerms)
    setDataType(dataType)
    router.push(`/search?q=${encodeURIComponent(searchTerms)}&type=${dataType}`)
  }

  if (loading) {
    return <div>Loading</div>;  // Change this to a proper loading output
  }
  if (error) {
    return (
      <div>
        {error.message}
      </div>
    );
  }

  return (
    <MantineProvider inherit withGlobalStyles withNormalizeCSS theme={argaBrandLight}>
      <Box>
        <Search onSearch={onSearch} />

        <Paper radius="xl" p="xl" sx={{ border: "1px solid #dbdbdb" }} pos="relative">
          <LoadingOverlay
            overlayColor={theme.colors.midnight[0]}
            transitionDuration={500}
            loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
            visible={loading}
            radius="xl"
          />
          <Text size="lg" ml={20} mb={30}>
            {!loading && data
              ? (<><strong>{data?.search.fullText.total} </strong> search results found for <strong>{query} </strong></>)
              : null
            }
          </Text>
          <SearchResults results={data?.search.fullText.records || []} />

          <Paper bg="white" p={20} m={40} radius="lg">
            <Pagination
              color={"attribute.2"}
              size="lg"
              radius="xl"
              position="center"
              spacing="md"
              total={totalPages}
              page={pagination.page}
              onChange={page => {
                setPagination({ page, pageSize: PAGE_SIZE })
              }}
            />
          </Paper>
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
    horizontalGrouping: {
      [theme.fn.smallerThan('lg')]: {
        display: 'none',
      },
    },
    verticalGrouping: {
      [theme.fn.largerThan('lg')]: {
        display: 'none',
      },
    },
    attribute: {
      background:theme.colors.attribute[0],
      '&:hover, &:focus': {
        background: theme.colors.attribute[2]
      }
    }   
  }
});
