"use client";

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import {
  Paper,
  Title,
  Box,
  Text,
  SimpleGrid,
  Stack,
  Grid,
  Container,
  Group,
  Drawer,
  Button,
  Badge,
  Accordion,
  Avatar,
  Divider,
  UnstyledButton,
  Flex,
  ThemeIcon,
} from "@mantine/core";

import { IconCopy, IconDownload, IconFilter } from "@tabler/icons-react";
import { useEffect, useState, use, ReactElement } from "react";
import { LoadOverlay } from "@/components/load-overlay";
import { Filter } from "@/components/filtering/common";
import ClassificationHeader from "@/components/classification-header";
import { MAX_WIDTH } from "@/app/constants";
import { PaginationBar } from "@/components/pagination";
import { Attribute, DataField } from "@/components/highlight-stack";
import { useDisclosure } from "@mantine/hooks";
import { HigherClassificationFilters } from "@/components/filtering/higher-classification";
import { VernacularGroupFilters } from "@/components/filtering/vernacular-group";
// import { EcologyFilters } from "@/components/filtering/ecology";
// import { IbraFilters } from "@/components/filtering/ibra";
// import { ImcraFilters } from "@/components/filtering/imcra";
// import { StateFilters } from "@/components/filtering/state";
// import { DrainageBasinFilters } from "@/components/filtering/drainage-basin";
import { TachoChart } from "@/components/graphing/tacho";
import { BarChart } from "@/components/graphing/bar";
import { BushfireRecoveryFilters } from "@/components/filtering/bushfire-recovery";
import { DataTable, DataTableRow } from "@/components/data-table";
import { SpeciesCard } from "@/components/species-card";
import { usePreviousPage } from "@/components/navigation-history";
import { usePathname } from "next/navigation";
import { HasDataFilters } from "@/components/filtering/has-data";
import { Photo } from "@/app/type";
import { useDatasets } from "@/app/source-provider";
import { GenomeCompletion } from "@/app/genome-tracker/_components/genome-completion";
import { GroupDetailRadial } from "@/app/genome-tracker/_components/grouping-completion";
import { CompletionStepper } from "@/app/genome-tracker/_components/completion-stepper";

const PAGE_SIZE = 10;

interface Filters {
  classifications: Filter[];
  vernacularGroup?: Filter;
  ecology?: Filter;
  ibra?: Filter;
  imcra?: Filter;
  state?: Filter;
  drainageBasin?: Filter;
  bushfireRecovery: Filter[];
  dataTypes: Filter[];
}

const GET_SPECIES = gql`
  query TaxaSpecies($rank: TaxonRank, $canonicalName: String, $datasetId: UUID, $page: Int, $perPage: Int) {
    taxon(by: { classification: { rank: $rank, canonicalName: $canonicalName, datasetId: $datasetId } }) {
      species(page: $page, perPage: $perPage) {
        total
        records {
          taxonomy {
            scientificName
            canonicalName
          }
          photo {
            url
            publisher
            license
            rightsHolder
          }
          dataSummary {
            genomes
            loci
            specimens
            other
          }
        }
      }
    }
  }
`;

const GET_TAXON = gql`
  query TaxonDetails($rank: TaxonRank, $canonicalName: String, $datasetId: UUID, $lowerRank: TaxonRank) {
    taxon(by: { classification: { rank: $rank, canonicalName: $canonicalName, datasetId: $datasetId } }) {
      scientificName
      canonicalName
      authorship
      status
      nomenclaturalCode
      citation
      source
      sourceUrl

      hierarchy {
        scientificName
        canonicalName
        rank
        depth
      }

      lowerRankSummary: summary(rank: $lowerRank) {
        total
        genomes
        genomicData
      }

      speciesRankSummary: summary(rank: "SPECIES") {
        total
        genomes
        genomicData
      }

      speciesGenomicDataSummary {
        canonicalName
        genomes
        totalGenomic
      }

      speciesGenomesSummary {
        canonicalName
        genomes
        totalGenomic
      }
    }
  }
`;

interface DataBreakdown {
  canonicalName: string;
  genomes: number;
  totalGenomic: number;
}

interface ClassificationNode {
  scientificName: string;
  canonicalName: string;
  rank: string;
  depth: number;
}

export interface Taxonomy {
  scientificName: string;
  scientificNameAuthorship: string;
  canonicalName: string;
  status: string;
  nomenclaturalCode: string;
  citation?: string;
  source?: string;
  sourceUrl?: string;
  hierarchy: ClassificationNode[];
  speciesGenomicDataSummary: DataBreakdown[];
  speciesGenomesSummary: DataBreakdown[];
  lowerRankSummary: {
    total: number;
    genomes: number;
    genomicData: number;
  };
  speciesRankSummary: {
    total: number;
    genomes: number;
    genomicData: number;
  };
  speciesSummary: {
    total: number;
    genomes: number;
    totalGenomic: number;
  };
  descendants: {
    canonicalName: string;
    species: number;
    speciesData: number;
    speciesGenomes: number;
  }[];
}

interface DataSummary {
  genomes: number;
  loci: number;
  specimens: number;
  other: number;
}

interface Species {
  taxonomy: {
    scientificName: string;
    canonicalName: string;
  };
  photo?: Photo;
  dataSummary: DataSummary;
}

interface FilterOptions {
  ecology: string[];
  ibra: string[];
  imcra: string[];
  state: string[];
  drainageBasin: string[];
}

interface Taxa {
  species: {
    records: Species[];
    total: number;
  };
  filterOptions: FilterOptions;
}

interface QueryResults {
  taxon: Taxa;
}

interface TaxonResults {
  taxon: Taxonomy;
}

interface FiltersProps {
  filters: Filters;
  options?: FilterOptions;
  onChange: (filters: Filters) => void;
}

function Filters({ filters, options, onChange }: FiltersProps) {
  const [classifications, setClassifications] = useState<Filter[]>(filters.classifications);
  const [vernacularGroup, setVernacularGroup] = useState<Filter | undefined>(filters.vernacularGroup);
  const [ecology, setEcology] = useState<Filter | undefined>(filters.ecology);
  const [ibra, setIbra] = useState<Filter | undefined>(filters.ibra);
  const [imcra, setImcra] = useState<Filter | undefined>(filters.imcra);
  const [state, setState] = useState<Filter | undefined>(filters.state);
  const [drainageBasin, setDrainageBasin] = useState<Filter | undefined>(filters.drainageBasin);
  const [bushfireRecovery, setBushfireRecovery] = useState<Filter[]>(filters.bushfireRecovery);
  const [dataTypes, setDataTypes] = useState<Filter[]>(filters.dataTypes);

  useEffect(() => {
    onChange({
      classifications,
      vernacularGroup,
      ecology,
      ibra,
      imcra,
      state,
      drainageBasin,
      bushfireRecovery,
      dataTypes,
    });
  }, [
    classifications,
    vernacularGroup,
    ecology,
    ibra,
    imcra,
    state,
    drainageBasin,
    bushfireRecovery,
    dataTypes,
    onChange,
  ]);

  return (
    <Accordion defaultValue="classification" variant="separated">
      <Accordion.Item value="classification">
        <Accordion.Control>
          <FilterGroup
            label="Higher classification filters"
            description="Limit data based on taxonomy"
            image="/icons/data-type/Data type_ Higher taxon report.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <HigherClassificationFilters filters={classifications} onChange={setClassifications} />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="hasData">
        <Accordion.Control>
          <FilterGroup
            label="Data types"
            description="Only show species that have specific types of data"
            image="/icons/data-type/Data type_ Whole genome.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <HasDataFilters filters={dataTypes} onChange={setDataTypes} />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="vernacular">
        <Accordion.Control>
          <FilterGroup
            label="Vernacular group"
            description="Birds, Flowering plants, Bacteria, etc."
            image="/icons/data-type/Data type_ Species (and subspecies) report.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <VernacularGroupFilters value={vernacularGroup?.vernacularGroup} onChange={setVernacularGroup} />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="regions">
        <Accordion.Control>
          <FilterGroup
            label="Regions"
            description="Ecological and administrative boundaries"
            image="/icons/list-group/List group_ Terrestrial.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          {/* <Stack>
            <Box>
              <Text fw={300} fz="sm">
                Ecology
              </Text>
              <EcologyFilters value={ecology?.} options={options?.ecology || []} onChange={setEcology} />
            </Box>
            <Box>
              <Text fw={300} fz="sm">
                Ibra Region
              </Text>
              <IbraFilters value={ibra?.value} options={options?.ibra || []} onChange={setIbra} />
            </Box>
            <Box>
              <Text fw={300} fz="sm">
                Imcra Region
              </Text>
              <ImcraFilters value={imcra?.value} options={options?.imcra || []} onChange={setImcra} />
            </Box>
            <Box>
              <Text fw={300} fz="sm">
                State
              </Text>
              <StateFilters value={state?.value} options={options?.state || []} onChange={setState} />
            </Box>
            <Box>
              <Text fw={300} fz="sm">
                Drainage Basin
              </Text>
              <DrainageBasinFilters
                value={drainageBasin?.value}
                options={options?.drainageBasin || []}
                onChange={setDrainageBasin}
              />
            </Box>
          </Stack> */}
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="bushfire">
        <Accordion.Control>
          <FilterGroup
            label="Bushfire traits"
            description="Bushfire vulnerability and recovery"
            image="/icons/list-group/List group_ Bushfire vulnerable.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <BushfireRecoveryFilters filters={bushfireRecovery} onChange={setBushfireRecovery} />
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
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

function FilterBadge({ filter }: { filter: Filter }) {
  return (
    <Badge variant="outline">
      {filter.scientificName || filter.canonicalName || filter.vernacularGroup || filter.hasData}
    </Badge>
  );
}

interface SpeciesProps {
  rank: string;
  canonicalName: string;
  datasetId: string;
}

function Species({ rank, canonicalName, datasetId }: SpeciesProps) {
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);

  const [filters, setFilters] = useState<Filters>({
    classifications: [
      {
        canonicalName,
        editable: false,
      },
    ],
    bushfireRecovery: [],
    dataTypes: [],
  });

  const flattenFilters = (filters: Filters) => {
    const items = [
      ...filters.classifications,
      filters.vernacularGroup,
      filters.ecology,
      filters.ibra,
      filters.imcra,
      filters.state,
      filters.drainageBasin,
      ...filters.bushfireRecovery,
      ...filters.dataTypes,
    ];

    return items.filter((item): item is Filter => !!item);
  };

  const { loading, error, data, previousData } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
      rank,
      canonicalName,
      datasetId,
      page,
      perPage: PAGE_SIZE,
      /* filters: flattenFilters(filters)
*   .map(intoFilterItem)
      .filter((item) => item), */
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  const records = data?.taxon.species.records || previousData?.taxon.species.records;

  return (
    <Stack>
      <Drawer opened={opened} onClose={close} withCloseButton={false} position="right" size="xl">
        <Box pt={200}>
          <Filters filters={filters} onChange={setFilters} />
        </Box>
      </Drawer>

      <LoadOverlay visible={loading} />

      <Grid gutter={50} align="baseline">
        <Grid.Col span="content">
          <Group>
            <Title order={5}>Browse species</Title>
            <Text fz="sm" fw={300}>
              ({data?.taxon.species.total} results)
            </Text>
          </Group>
        </Grid.Col>

        <Grid.Col span="auto">
          <Group>
            <Text fz="sm" fw={300}>
              Filters
            </Text>
            {flattenFilters(filters).map((filter, idx) => (
              <FilterBadge key={idx} filter={filter} />
            ))}
          </Group>
        </Grid.Col>

        <Grid.Col span="content">
          <Button leftSection={<IconFilter />} variant="subtle" onClick={open} color="shellfish.7">
            Filter
          </Button>
        </Grid.Col>
      </Grid>

      <SimpleGrid cols={5} pt={40}>
        {records?.map((record) => (
          <SpeciesCard key={record.taxonomy.scientificName} species={record} />
        ))}
      </SimpleGrid>

      <PaginationBar total={data?.taxon.species.total} page={page} pageSize={PAGE_SIZE} onChange={setPage} />
    </Stack>
  );
}

const CLASSIFICATIONS_CHILD_MAP: Record<string, string> = {
  DOMAIN: "kingdom",
  SUPERKINGDOM: "kingdom",
  KINGDOM: "phylum",
  SUBKINGDOM: "phylum",
  PHYLUM: "class",
  SUBPHYLUM: "class",
  SUPERCLASS: "class",
  CLASS: "order",
  SUBCLASS: "order",
  INFRACLASS: "order",
  SUPERORDER: "order",
  ORDER: "family",
  SUBORDER: "family",
  INFRAORDER: "family",
  SUPERFAMILY: "family",
  FAMILY: "genus",
  SUBFAMILY: "genus",
  SUPERTRIBE: "genus",
  TRIBE: "genus",
  SUBTRIBE: "genus",
  GENUS: "species",
  SUBGENUS: "species",
  SPECIES: "subspecies",
  SUBSPECIES: "subspecies",

  UNRANKED: "unranked",
  HIGHERTAXON: "higher taxon",

  AGGREGATEGENERA: "aggregate genera",
  AGGREGATESPECIES: "aggregate species",
  INCERTAESEDIS: "incertae sedis",

  REGNUM: "division",
  DIVISION: "classis",
  SUBDIVISION: "classis",
  CLASSIS: "ordo",
  SUBCLASSIS: "ordo",
  SUPERORDO: "ordo",
  ORDO: "familia",
  SUBORDO: "familia",
  COHORT: "familia",
  FAMILIA: "genus",
  SUBFAMILIA: "genus",
  SECTION: "species",
  SECTIO: "species",
  SERIES: "species",
  VARIETAS: "subvarietas",
  SUBVARIETAS: "subvarietas",
  FORMA: "forma",

  NOTHOVARIETAS: "nothovarietas",
  INFRASPECIES: "infraspecies",
  REGIO: "regio",
  SPECIALFORM: "special form",
};

function pluralTaxon(rank: string) {
  if (rank === "division") return "divisions";
  else if (rank === "kingdom") return "kingdoms";
  else if (rank === "phylum") return "phyla";
  else if (rank === "class") return "classes";
  else if (rank === "order") return "orders";
  else if (rank === "family") return "families";
  else if (rank === "genus") return "genera";
  else return rank;
}

interface ActionButtonProps {
  label: string;
  icon: ReactElement;
}

function ActionButton({ label, icon }: ActionButtonProps) {
  return (
    <UnstyledButton>
      <Flex gap={12} align="center">
        <ThemeIcon radius="md" color="midnight.11">
          {icon}
        </ThemeIcon>
        <Text size="sm" fw={600} c="midnight.11">
          {label}
        </Text>
      </Flex>
    </UnstyledButton>
  );
}

function DataSummary({ rank, taxon }: { rank: string; taxon: Taxonomy | undefined }) {
  const childTaxon = CLASSIFICATIONS_CHILD_MAP[rank] || "";
  const childTaxonLabel = pluralTaxon(childTaxon);

  const minDate = new Date("2009-01-01");
  const maxDate = new Date(`${new Date().getFullYear() + 10}-01-01`);

  const thresholds = [
    { name: "low", color: "#f47625", start: 0, end: 25 },
    { name: "decent", color: "#febb1e", start: 25, end: 75 },
    { name: "great", color: "#97bc5d", start: 75, end: 100 },
  ];

  const speciesGenomes = taxon?.speciesGenomesSummary
    .filter((i) => i.genomes > 0)
    .map((summary) => {
      const linkName = encodeURIComponent(summary.canonicalName.replaceAll(" ", "_"));
      return {
        name: summary.canonicalName || "",
        value: summary.genomes,
        href: `/species/${linkName}`,
      };
    })
    .sort((a, b) => b.value - a.value);

  const speciesOther = taxon?.speciesGenomicDataSummary
    .filter((i) => i.totalGenomic > 0)
    .map((summary) => {
      const linkName = encodeURIComponent(summary.canonicalName.replaceAll(" ", "_"));
      return {
        name: summary.canonicalName || "",
        value: summary.totalGenomic,
        href: `/species/${linkName}`,
      };
    })
    .sort((a, b) => b.value - a.value);

  const genomePercentile = taxon && (taxon.speciesRankSummary.genomes / taxon.speciesRankSummary.total) * 100;
  const otherPercentile = taxon && (taxon.speciesRankSummary.genomicData / taxon.speciesRankSummary.total) * 100;

  function collapsable(span: number) {
    return { base: span, xs: 12, sm: 12, md: span, lg: span, xl: span };
  }

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={5}>Data summary</Title>
      </Grid.Col>
      <Grid.Col span="content">
        <Paper px="lg" pb="lg" w={430} h={560} radius="lg" withBorder>
          <Stack h="100%" justify="space-between">
            <GroupDetailRadial
              height={400}
              radial={25}
              query={{
                taxonRank: rank,
                taxonCanonicalName: taxon?.canonicalName || "",
                includeRanks: [rank, ALL_RANKS[ALL_RANKS.indexOf(rank) + 1]],
                rankStats: ALL_RANKS.slice(ALL_RANKS.indexOf(rank) + 1),
              }}
              fontSize={7}
              switcherGap="sm"
              switcherSize="sm"
              hideDescription
            />
            <Text fw={300} size="sm">
              Total of species for which a whole genome has been sequenced and made available aggregated by higher
              classification units.
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>
      <Grid.Col span="auto">
        <Paper h={560} p="lg" radius="lg" withBorder>
          <Stack h="100%" justify="space-between">
            <Box h={400}>
              <GenomeCompletion
                taxonRank={rank}
                taxonCanonicalName={taxon?.canonicalName || ""}
                domain={[minDate, maxDate]}
              />
            </Box>
            <Text fw={300} size="sm">
              This graph shows the aggregated total of species for which a whole genome has been sequenced and made
              available. The first instance of a whole genome sequence for an individual species has been plotted as an
              accumulated total. Statistics based on records indexed within ARGA.
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col span="content">
        <Paper h={560} p="xl" radius="lg" withBorder>
          <Title order={5}>Taxonomic breakdown</Title>

          <DataTable my={8}>
            {rank !== "GENUS" && (
              <DataTableRow label={`Number of ${childTaxonLabel}`}>
                <DataField value={taxon?.lowerRankSummary?.total}></DataField>
              </DataTableRow>
            )}
            <DataTableRow label="Number of species/OTUs">
              <DataField value={Humanize.formatNumber(taxon?.speciesRankSummary.total || 0)} />
            </DataTableRow>
            {rank !== "GENUS" && (
              <DataTableRow label={`${Humanize.capitalize(childTaxonLabel)} with genomes`}>
                <DataField value={Humanize.formatNumber(taxon?.lowerRankSummary?.genomes || 0)} />
              </DataTableRow>
            )}
            <DataTableRow label="Species with genomes">
              <DataField value={Humanize.formatNumber(taxon?.speciesRankSummary.genomes || 0)} />
            </DataTableRow>
            {rank !== "GENUS" && (
              <DataTableRow label={`${Humanize.capitalize(childTaxonLabel)} with data`}>
                <DataField value={Humanize.formatNumber(taxon?.lowerRankSummary.genomicData || 0)} />
              </DataTableRow>
            )}
            <DataTableRow label="Species with data">
              <DataField value={Humanize.formatNumber(taxon?.speciesRankSummary.genomicData || 0)} />
            </DataTableRow>
          </DataTable>
          <Stack mx={10} mt={5}>
            <Attribute
              label="Species with most genomes"
              value={speciesGenomes?.[0]?.name}
              href={`/species/${speciesGenomes?.[0]?.name?.replaceAll(" ", "_")}/taxonomy`}
            />
            <Attribute
              label="Species with most data"
              value={speciesOther?.[0]?.name}
              href={`/species/${speciesOther?.[0]?.name.replaceAll(" ", "_")}/taxonomy`}
            />
          </Stack>
        </Paper>
      </Grid.Col>
      <Grid.Col span={12}>
        <Grid mt="xl">
          <Grid.Col span={12}>
            <Stack>
              <Text fz="sm" fw={300}>
                Complete genome for at least one representative species from each:
              </Text>
              <Group grow px="lg">
                <CompletionStepper rank={rank} canonicalName={taxon?.canonicalName} />
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ xs: 12, sm: 12, md: 8, lg: 9, xl: 10 }}>
            <Grid>
              <Grid.Col span={collapsable(4)}>
                <Stack>
                  <Text fz="sm" fw={300}>
                    Percentage of species with genomes
                  </Text>
                  {taxon && (
                    <TachoChart
                      mt={10}
                      h={150}
                      w={300}
                      thresholds={thresholds}
                      value={Math.round(genomePercentile || 0)}
                    />
                  )}
                </Stack>
              </Grid.Col>
              <Grid.Col span={collapsable(8)}>
                <Stack>
                  <Text fz="sm" fw={300}>
                    Species with genomes
                  </Text>
                  {speciesGenomes && <BarChart h={200} data={speciesGenomes.slice(0, 8)} spacing={0.1} />}
                </Stack>
              </Grid.Col>
              <Grid.Col span={collapsable(4)}>
                <Stack>
                  <Text fz="sm" fw={300}>
                    Percentage of species with any genetic data
                  </Text>
                  {taxon && (
                    <TachoChart
                      mt={10}
                      h={150}
                      w={300}
                      thresholds={thresholds}
                      value={Math.round(otherPercentile || 0)}
                    />
                  )}
                </Stack>
              </Grid.Col>
              <Grid.Col span={collapsable(8)}>
                <Stack>
                  <Text fz="sm" fw={300}>
                    Species with any genetic data
                  </Text>
                  {speciesOther && <BarChart h={200} data={speciesOther.slice(0, 8)} spacing={0.1} />}
                </Stack>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={{ xs: 12, sm: 12, md: 4, lg: 3, xl: 2 }}>
            <Paper radius="lg" p="md" h="100%" withBorder>
              <Stack>
                <Text c="midnight.9" size="xs" fw="bold">
                  Note:
                </Text>
                <Text c="midnight.11" size="xs">
                  For the purposes of these data summaries, a “whole genome” is interpreted as being an entire assembly
                  of the genome, with or without chromosome assemblies (i.e. assemblies which are at least represented
                  as “scaffold assemblies” in the NCBI GenBank Genomes Database).
                </Text>
                <Text c="midnight.11" size="xs">
                  The higher classification of Australia&apos;s biodiversity is driven by the taxonomic system managed
                  by the Atlas of Living Australia. The Atlas of Living Australia hosts a record of all of the species
                  that appear on the Australian National Species List, and services nationally agreed nomenclature for
                  these species.
                </Text>
                <Text c="midnight.11" size="xs">
                  The data used to generate the page statistics and graphics are accurate to dd/mm/yy. Data and graphics
                  on this page may be shared under a CC BY 4.0 licence.
                </Text>
                <Divider my="xs" />
                <Stack>
                  <ActionButton label="Copy page citation" icon={<IconCopy size="1rem" />} />
                  <ActionButton label="Download raw data as CSV" icon={<IconDownload size="1rem" />} />
                  <ActionButton label="Download graphics as PNG file" icon={<IconDownload size="1rem" />} />
                </Stack>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
}

interface ClassificationPageProps {
  params: Promise<{
    rank: string;
    name: string;
  }>;
}

const ALL_RANKS = ["DOMAIN", "KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"];

export default function ClassificationPage(props: ClassificationPageProps) {
  const params = use(props.params);
  const rank = params.rank.toUpperCase();
  const lowerRank = CLASSIFICATIONS_CHILD_MAP[rank].toUpperCase() || "";

  const { names } = useDatasets();
  const datasetId = names.get("Atlas of Living Australia")?.id;

  const pathname = usePathname();
  const [_, setPreviousPage] = usePreviousPage();

  const taxonResults = useQuery<TaxonResults>(GET_TAXON, {
    variables: {
      rank,
      datasetId,
      canonicalName: params.name,
      lowerRank,
    },
  });

  useEffect(() => {
    setPreviousPage({ name: `browsing ${params.name}`, url: pathname });
  }, [params.name, pathname, setPreviousPage]);

  return (
    <Stack mt={40}>
      <ClassificationHeader rank={rank} classification={params.name} taxon={taxonResults.data?.taxon} />

      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Stack>
            {/* <Grid>
              <Grid.Col span={3}>
                <LoadPanel visible={taxonResults.loading} h={180}>
                  <Title pb={10} order={5}>
                    Taxonomy
                  </Title>
                  <TaxonomyDetails taxon={taxonResults.data?.taxon} />
                </LoadPanel>
              </Grid.Col>
              <Grid.Col span={12}>
                <LoadPanel visible={taxonResults.loading} h={180}>
                  <Title pb={10} order={5}>
                    Higher classification
                  </Title>
                  <HigherClassification taxon={taxonResults.data?.taxon} />
                </LoadPanel>
              </Grid.Col>
            </Grid> */}

            <Paper p="xl" radius="lg" pos="relative" withBorder>
              {taxonResults.called && <DataSummary rank={rank} taxon={taxonResults.data?.taxon} />}
            </Paper>

            <Paper p="xl" radius="lg" pos="relative" withBorder>
              <Species rank={rank} canonicalName={params.name} datasetId={datasetId ?? ""} />
            </Paper>
          </Stack>
        </Container>
      </Paper>
    </Stack>
  );
}
