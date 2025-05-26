"use client";

import { gql, useQuery } from "@apollo/client";
import { Accordion, Alert, Avatar, Box, Container, Grid, Group, Paper, Stack, Text, TextInput } from "@mantine/core";
import { IconExclamationMark, IconSearch } from "@tabler/icons-react";
import * as Humanize from "humanize-plus";
import { parseAsInteger, useQueryState } from "nuqs";

import { Filter } from "@/components/filtering/common";
import { DataTypeFilters } from "@/components/filtering/data-type";
import { PaginationBar, PaginationSize } from "@/components/pagination";

import { TableCardLayout, TableCardSwitch } from "@/components/table-card-switch";
import { Suspense, useEffect, useState } from "react";
import { MAX_WIDTH } from "../constants";
import { Results } from "./_components/result";

interface Filters {
  classifications: Filter[];
  dataTypes: Filter[];
}

interface Classification {
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  regnum?: string;
  division?: string;
  classis?: string;
  ordo?: string;
  familia?: string;
}

interface DataSummary {
  genomes: number;
  loci: number;
  specimens: number;
  other: number;
  totalGenomic: number;
}

export interface Item {
  type: string;
  score: number;
  status: string;
  canonicalName: string;
  subspecies?: string[];
  synonyms?: string[];
  commonNames?: string[];
  classification?: Classification;
  dataSummary: DataSummary;

  accession?: string;
  genomeRep?: string;
  dataSource?: string;
  level?: string;
  assemblyType?: string;
  referenceGenome?: boolean;
  releaseDate?: string;

  locusType?: string;
  voucherStatus?: string;
  eventDate?: string;
  eventLocation?: string;

  institutionCode?: string;
  collectionCode?: string;
  recordedBy?: string;
  identifiedBy?: string;
}

interface FullTextResults {
  records: Item[];
  total: number;
}

interface SearchResults {
  fullText: FullTextResults;
}

interface QueryResults {
  search: SearchResults;
}

const PAGE_SIZE = 10;

const SEARCH_FULLTEXT = gql`
  query FullTextSearch($query: String, $page: Int, $perPage: Int, $filters: [FilterItem]) {
    search(filters: $filters) {
      fullText(query: $query, page: $page, perPage: $perPage) {
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
              regnum
              division
              classis
              ordo
              familia
            }
            dataSummary {
              genomes
              loci
              specimens
              other
              totalGenomic
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
            assemblyType
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
  }
`;

interface SearchProperties {
  onSearch: (searchTerms: string, dataType: string) => void;
  data: QueryResults | undefined;
  loading: boolean;
  initialQuery: string;
}

function Search({ onSearch, initialQuery, data, loading }: SearchProperties & { initialQuery: string }) {
  const [value, setValue] = useState(initialQuery);
  const [searchTerms, setSearchTerms] = useState(initialQuery);
  const [dataType, setDataType] = useState("all");

  function _onFilter(value: string) {
    setDataType(value);
    onSearch(searchTerms, value);
  }

  function onSearchHandler(value: string) {
    setSearchTerms(value);
    onSearch(value, dataType);
  }

  return (
    <Paper bg="midnight.0" p={10} radius={0}>
      <Box>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            onSearchHandler(value);
          }}
        >
          <Grid align="center" m={10}>
            <Grid.Col span={12}>
              <TextInput
                placeholder="e.g. sequence accession, species name"
                value={value}
                onChange={(val) => {
                  setValue(val.target.value);
                }}
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
  );
}

interface FilterGroupProps {
  label: string;
  description: string;
  image: string;
}

function FilterGroup({ label, description, image }: FilterGroupProps) {
  return (
    <Group wrap="nowrap">
      <Avatar src={image} size="lg" />
      <div>
        <Text>{label}</Text>
        <Text size="sm" c="dimmed" fw={400} lineClamp={1}>
          {description}
        </Text>
      </div>
    </Group>
  );
}

interface FiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

function Filters({ filters, onChange }: FiltersProps) {
  const [classifications, _setClassifications] = useState<Filter[]>(filters.classifications);
  const [dataTypes, setDataTypes] = useState<Filter[]>(filters.dataTypes);

  useEffect(() => {
    onChange({
      classifications,
      dataTypes,
    });
  }, [classifications, dataTypes, onChange]);

  return (
    <Accordion defaultValue="dataType" variant="separated">
      <Accordion.Item value="dataType">
        <Accordion.Control>
          <FilterGroup
            label="Data types"
            description="Only show records of the specific types enabled"
            image="/icons/data-type/Data type_ Whole genome.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <DataTypeFilters filters={dataTypes} onChange={setDataTypes} />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

function SearchPage() {
  const [layout, setLayout] = useState<TableCardLayout>("table");
  const [query, setQuery] = useQueryState("q", { defaultValue: "" });

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage, setPerPage] = useQueryState("perPage", parseAsInteger.withDefault(10));

  const [lastResultCount, setLastResultCount] = useState<number | null>(null);

  const { loading, error, data } = useQuery<QueryResults>(SEARCH_FULLTEXT, {
    variables: {
      query,
      page,
      perPage,
      filters: [],
    },
  });

  function onSearch(searchTerms: string, _dataType: string) {
    setQuery(searchTerms);
    setPage(1);
  }

  // Handle pagination changes on layout/filter change
  useEffect(() => {
    setPerPage(layout === "card" ? 12 : 10);
  }, [layout]);

  // Effect hook to stop the search results jumping to 0 when paginating
  useEffect(() => {
    if (data) setLastResultCount(data.search.fullText.total);
  }, [data]);

  return (
    <>
      <Search onSearch={onSearch} data={data} loading={loading} initialQuery={query} />

      <Paper>
        <Container maw={MAX_WIDTH} fluid py="xl">
          <Stack>
            <Group justify="space-between">
              <Text fz="lg">
                {lastResultCount !== null ? (
                  <>
                    <b>
                      {1 + perPage * (page - 1)}-{Math.min(page * perPage, lastResultCount)}
                    </b>{" "}
                    of <b>{Humanize.formatNumber(lastResultCount)}</b>{" "}
                  </>
                ) : (
                  "Loading "
                )}
                search results{lastResultCount ? " found" : ""} for <b>{query}</b>
              </Text>
              <Group>
                <PaginationSize
                  options={layout === "card" ? [12, 24, 48] : [10, 25, 50]}
                  value={perPage}
                  onChange={setPerPage}
                />
                <TableCardSwitch layout={layout} onChange={setLayout} />
              </Group>
            </Group>

            {error && (
              <Alert radius="lg" variant="light" color="red" title="Unexpected failure" icon={<IconExclamationMark />}>
                <Text c="red">{error.message}</Text>
              </Alert>
            )}
            <Results layout={layout} items={data?.search.fullText.records} perPage={perPage} />
            <PaginationBar total={data?.search.fullText.total} page={page} pageSize={perPage} onChange={setPage} />
          </Stack>
        </Container>
      </Paper>
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
