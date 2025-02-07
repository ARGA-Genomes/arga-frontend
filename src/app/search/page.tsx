"use client";

import { gql, useQuery } from "@apollo/client";

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
  SimpleGrid,
  Accordion,
  Avatar,
  Alert,
} from "@mantine/core";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { IconExclamationMark, IconEye, IconSearch } from "@tabler/icons-react";
import { MAX_WIDTH } from "../constants";
import { LoadPanel } from "@/components/load-overlay";
import { FilterBar } from "@/components/filtering/filter-bar";
import { PaginationBar } from "@/components/pagination";
import { Attribute, AttributePill, DataField } from "@/components/data-fields";
import { HighlightStack } from "@/components/highlight-stack";
import { usePreviousPage } from "@/components/navigation-history";
import { useHover } from "@mantine/hooks";
import { Filter, intoFilterItem } from "@/components/filtering/common";
import { DataTypeFilters } from "@/components/filtering/data-type";

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

interface Item {
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

function TaxonItem({ item }: { item: Item }) {
  const itemLinkName = item.canonicalName.replaceAll(" ", "_");
  const { hovered, ref } = useHover();

  return (
    <Paper
      radius="lg"
      withBorder
      style={{ border: "solid 1px var(--mantine-color-moss-4)" }}
      ref={ref}
      bg={hovered ? "#96bb5c22" : undefined}
    >
      <Grid gutter="xl">
        <Grid.Col span="content">
          <Paper
            bg="moss.4"
            w={180}
            style={{
              borderRadius: "var(--mantine-radius-lg) 0 0 var(--mantine-radius-lg)",
              border: "none",
            }}
          >
            <Group gap="xs" wrap="nowrap">
              <Image src={"card-icons/type/species_report.svg"} fit="contain" h={80} w="auto" alt="" />
              <Text c="white" fw={600} fz="md" mb="sm" style={{ alignSelf: "end", lineHeight: "normal" }}>
                Species Report
              </Text>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={2} my="auto">
          <Attribute label="Accepted species name">
            <Stack gap={0} justify="center">
              <Text ml="sm" size="sm" fw={550} fs="italic">
                {item.canonicalName}
              </Text>
              <Text ml="sm" fz="sm" c="dimmed">
                {item.synonyms?.[0] ? `syn. ${item.synonyms[0]}` : null}
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
            <Button
              h="100%"
              bg="midnight.10"
              style={{
                borderRadius: "0 var(--mantine-radius-lg) var(--mantine-radius-lg) 0",
              }}
            >
              <Stack gap={3} align="center">
                <IconEye />
                <Text fw={600}>view</Text>
              </Stack>
            </Button>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function TaxonSummary({ data }: { data: DataSummary }) {
  const other = data.loci + data.other;

  return (
    <SimpleGrid cols={2}>
      <AttributePill label="Assemblies" color={data.genomes ? "moss.3" : "bushfire.2"} value={data.genomes} />
      <AttributePill label="Other data" color={other ? "moss.3" : "bushfire.2"} value={other} />
    </SimpleGrid>
  );
}

function TaxonDetails({ item }: { item: Item }) {
  const taxon = item.classification;
  if (!taxon) return null;

  return (
    <SimpleGrid cols={6}>
      {taxon.regnum ? (
        <AttributePill label="Regnum" value={taxon.regnum} href={`/regnum/${taxon.regnum}`} />
      ) : (
        <AttributePill label="Kingdom" value={taxon.kingdom} href={`/kingdom/${taxon.kingdom}`} />
      )}
      {taxon.division ? (
        <AttributePill label="Division" value={taxon.division} href={`/division/${taxon.division}`} />
      ) : (
        <AttributePill label="Phylum" value={taxon.phylum} href={`/phylum/${taxon.phylum}`} />
      )}
      {taxon.classis ? (
        <AttributePill label="Classis" value={taxon.classis} href={`/classis/${taxon.classis}`} />
      ) : (
        <AttributePill label="Class" value={taxon.class} href={`/class/${taxon.class}`} />
      )}
      {taxon.ordo ? (
        <AttributePill label="Ordo" value={taxon.ordo} href={`/ordo/${taxon.ordo}`} />
      ) : (
        <AttributePill label="Order" value={taxon.order} href={`/order/${taxon.order}`} />
      )}
      {taxon.familia ? (
        <AttributePill label="Familia" value={taxon.familia} href={`/familia/${taxon.familia}`} />
      ) : (
        <AttributePill label="Family" value={taxon.family} href={`/family/${taxon.family}`} />
      )}
      <AttributePill label="Genus" value={taxon.genus} href={`/genus/${taxon.genus}`} italic />
    </SimpleGrid>
  );
}

function GenomeItem({ item }: { item: Item }) {
  const itemLinkName = item.canonicalName.replaceAll(" ", "_");
  const { hovered, ref } = useHover();

  return (
    <Paper
      radius="lg"
      withBorder
      style={{ border: "solid 1px #f47c2e" }}
      ref={ref}
      bg={hovered ? "#f47c2e22" : undefined}
    >
      <Grid gutter="xl">
        <Grid.Col span="content">
          <Paper
            bg="#f47c2e"
            w={180}
            style={{
              borderRadius: "var(--mantine-radius-lg) 0 0 var(--mantine-radius-lg)",
              border: "none",
            }}
          >
            <Group gap="xs" wrap="nowrap">
              <Image src={"card-icons/type/whole_genomes.svg"} fit="contain" h={80} w="auto" alt="" />
              <Text c="white" fw={600} fz="md" mb="sm" style={{ alignSelf: "end", lineHeight: "normal" }}>
                Genome Assembly
              </Text>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={2} my="auto">
          <Attribute label="Accepted species name">
            <Text ml="sm" size="sm" fw={550} fs="italic">
              {item.canonicalName}
            </Text>
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
            <Button
              h="100%"
              bg="midnight.10"
              style={{
                borderRadius: "0 var(--mantine-radius-lg) var(--mantine-radius-lg) 0",
              }}
            >
              <Stack gap={3} align="center">
                <IconEye />
                <Text fw={600}>view</Text>
              </Stack>
            </Button>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function GenomeSummary({ item }: { item: Item }) {
  return (
    <SimpleGrid cols={2}>
      <Attribute label="Data source">
        <DataField value={item.dataSource} />
      </Attribute>
      <Attribute label="Release date">
        <DataField value={item.releaseDate} />
      </Attribute>
    </SimpleGrid>
  );
}

function GenomeDetails({ item }: { item: Item }) {
  return (
    <SimpleGrid cols={4}>
      <Attribute label="Accession">
        <DataField value={item.accession} />
      </Attribute>
      <AttributePill label="Representation" value={item.genomeRep} />
      <AttributePill label="Assembly type" value={item.assemblyType} />
      <AttributePill label="Assembly level" value={item.level} />
    </SimpleGrid>
  );
}

function LocusItem({ item }: { item: Item }) {
  const itemLinkName = item.canonicalName.replaceAll(" ", "_");
  const { hovered, ref } = useHover();

  return (
    <Paper
      radius="lg"
      withBorder
      style={{ border: "solid 1px #58a39d" }}
      ref={ref}
      bg={hovered ? "#58a39d22" : undefined}
    >
      <Grid gutter="xl">
        <Grid.Col span="content">
          <Paper
            bg="#58a39d"
            w={180}
            style={{
              borderRadius: "var(--mantine-radius-lg) 0 0 var(--mantine-radius-lg)",
              border: "none",
            }}
          >
            <Group gap="xs" wrap="nowrap">
              <Image src={"card-icons/type/markers.svg"} fit="contain" h={80} w="auto" alt="" />
              <Text c="white" fw={600} fz="md" mb="sm" style={{ alignSelf: "end", lineHeight: "normal" }}>
                Locus
              </Text>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={2} my="auto">
          <Attribute label="Accepted species name">
            <Text ml="sm" size="sm" fw={550} fs="italic">
              {item.canonicalName}
            </Text>
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
            <Button
              h="100%"
              bg="midnight.10"
              style={{
                borderRadius: "0 var(--mantine-radius-lg) var(--mantine-radius-lg) 0",
              }}
            >
              <Stack gap={3} align="center">
                <IconEye />
                <Text fw={600}>view</Text>
              </Stack>
            </Button>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function LocusSummary({ item }: { item: Item }) {
  return (
    <SimpleGrid cols={2}>
      <Attribute label="Data source">
        <DataField value={item.dataSource} />
      </Attribute>
      <Attribute label="Release date">
        <DataField value={item.eventDate} />
      </Attribute>
    </SimpleGrid>
  );
}

function LocusDetails({ item }: { item: Item }) {
  return (
    <SimpleGrid cols={4}>
      <AttributePill label="Accession" value={item.accession} />
      <AttributePill label="Gene name" value={item.locusType} />
      <AttributePill label="Sequence length" />
      <AttributePill label="Source molecule" />
    </SimpleGrid>
  );
}

function SpecimenItem({ item }: { item: Item }) {
  const itemLinkName = item.canonicalName.replaceAll(" ", "_");
  const { hovered, ref } = useHover();

  return (
    <Paper
      radius="lg"
      withBorder
      style={{ border: "solid 1px #f47c2e" }}
      ref={ref}
      bg={hovered ? "#f47c2e22" : undefined}
    >
      <Grid gutter="xl">
        <Grid.Col span="content">
          <Paper
            bg="#f47c2e"
            w={180}
            style={{
              borderRadius: "var(--mantine-radius-lg) 0 0 var(--mantine-radius-lg)",
              border: "none",
            }}
          >
            <Group gap="xs" wrap="nowrap">
              <Image src={"card-icons/type/specimens.svg"} fit="contain" h={80} w="auto" alt="" />
              <Text c="white" fw={600} fz="md" mb="sm" style={{ alignSelf: "end", lineHeight: "normal" }}>
                Specimen
              </Text>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={2} my="auto">
          <Attribute label="Accepted species name">
            <Text ml="sm" size="sm" fw={550} fs="italic">
              {item.canonicalName}
            </Text>
          </Attribute>
        </Grid.Col>

        <Grid.Col span="auto" my="auto">
          <SpecimenDetails item={item} />
        </Grid.Col>

        <Grid.Col span={2} my="auto">
          <SpecimenSummary item={item} />
        </Grid.Col>

        <Grid.Col span="content">
          <Link href={`/species/${itemLinkName}/specimens/${item.accession}`}>
            <Button
              h="100%"
              bg="midnight.10"
              style={{
                borderRadius: "0 var(--mantine-radius-lg) var(--mantine-radius-lg) 0",
              }}
            >
              <Stack gap={3} align="center">
                <IconEye />
                <Text fw={600}>view</Text>
              </Stack>
            </Button>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function SpecimenSummary({ item }: { item: Item }) {
  return (
    <SimpleGrid cols={2}>
      <Attribute label="Data source">
        <DataField value={item.dataSource} />
      </Attribute>
      <Attribute label="Collected date">
        <DataField value={item.eventDate} />
      </Attribute>
    </SimpleGrid>
  );
}

function SpecimenDetails({ item }: { item: Item }) {
  return (
    <SimpleGrid cols={4}>
      <AttributePill label="Accession" value={item.accession} />
      <AttributePill label="Institution" value={item.institutionCode} />
      <AttributePill label="Collection" value={item.collectionCode} />
      <AttributePill label="Collected by" value={item.recordedBy} />
    </SimpleGrid>
  );
}

function SearchItem({ item }: { item: Item }) {
  switch (item.type) {
    case "TAXON":
      return <TaxonItem item={item} />;
    case "GENOME":
      return <GenomeItem item={item} />;
    case "LOCUS":
      return <LocusItem item={item} />;
    case "SPECIMEN":
      return <SpecimenItem item={item} />;
    default:
      return null;
  }
}

function SearchResults({ results }: { results: Item[] }) {
  return (
    <Stack gap="xs">
      {results.map((record) => (
        <SearchItem item={record} key={`${record.canonicalName}-${record.type}`} />
      ))}
    </Stack>
  );
}

interface SearchProperties {
  onSearch: (searchTerms: string, dataType: string) => void;
  data: QueryResults | undefined;
  loading: boolean;
}

function Search(props: SearchProperties) {
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("q") || "");
  const [searchTerms, setSearchTerms] = useState(searchParams.get("q") || "");
  const [dataType, setDataType] = useState(searchParams.get("type") || "all");

  function _onFilter(value: string) {
    setDataType(value);
    props.onSearch(searchTerms, value);
  }

  function onSearch(value: string) {
    setSearchTerms(value);
    props.onSearch(value, dataType);
  }

  return (
    <Paper bg="midnight.0" p={10} radius={0}>
      <Box>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            onSearch(value);
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
            image="/card-icons/type/whole_genomes.svg"
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [dataTypes, setDataTypes] = useState(searchParams.getAll("type"));
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [_, setPreviousPage] = usePreviousPage();

  const [filters, setFilters] = useState<Filters>({
    classifications: [],
    dataTypes: dataTypes.map((value) => ({
      filter: "DATA_TYPE",
      action: "INCLUDE",
      value,
      editable: true,
    })),
  });

  useEffect(refreshUrl, [query, dataTypes, page, setPreviousPage, pathname, router, searchParams]);

  function refreshUrl() {
    const params = new URLSearchParams(searchParams);
    params.set("q", query);
    params.set("page", page.toString());

    params.delete("type");
    dataTypes.forEach((dataType) => {
      params.append("type", dataType);
    });

    const url = pathname + "?" + params.toString();
    setPreviousPage({ name: "search results", url });
    router.push(url);
  }

  function flattenFilters(filters: Filters) {
    const items = [...filters.classifications, ...filters.dataTypes];

    return items.filter((item): item is Filter => !!item);
  }

  const { loading, error, data } = useQuery<QueryResults>(SEARCH_FULLTEXT, {
    variables: {
      query,
      page,
      perPage: PAGE_SIZE,
      filters: flattenFilters(filters)
        .map(intoFilterItem)
        .filter((item) => item),
    },
  });

  function onSearch(searchTerms: string, _dataType: string) {
    setQuery(searchTerms);
    /* setDataTypes(dataType) */
    setPage(1);
  }

  function onFilter(all: Filters) {
    setDataTypes(all.dataTypes.map((dataType) => dataType.value));
    setFilters(all);
  }

  return (
    <>
      <Search onSearch={onSearch} data={data} loading={loading} />

      <Paper radius={0} py="xl">
        <Container maw={MAX_WIDTH}>
          <LoadPanel visible={loading}>
            <Stack>
              <FilterBar
                filters={flattenFilters(filters)}
                title={
                  <Group justify="left" gap={5}>
                    <Text fz="lg" fw={700}>
                      {data?.search.fullText.total}
                    </Text>
                    <Text fz="lg">search results found for</Text>
                    <Text fz="lg" fw={600}>
                      {query}
                    </Text>
                  </Group>
                }
              >
                <Filters filters={filters} onChange={onFilter} />
              </FilterBar>

              {error && (
                <Alert
                  radius="lg"
                  variant="light"
                  color="red"
                  title="Unexpected failure"
                  icon={<IconExclamationMark />}
                >
                  <Text c="red">{error.message}</Text>
                </Alert>
              )}
              <SearchResults results={data?.search.fullText.records || []} />
              <PaginationBar total={data?.search.fullText.total} page={page} pageSize={PAGE_SIZE} onChange={setPage} />
            </Stack>
          </LoadPanel>
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
