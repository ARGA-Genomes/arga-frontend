"use client";

// Types
import { RankSummary, Taxon } from "@/generated/types";

// Imports
import { MAX_WIDTH } from "@/app/constants";
import { CompletionStepper } from "@/app/genome-tracker/_components/completion-stepper";
import { GenomeCompletion } from "@/app/genome-tracker/_components/genome-completion";
import { GroupDetailRadial } from "@/app/genome-tracker/_components/grouping-completion";
import { useDatasets } from "@/app/source-provider";
import { BrowseSpecies } from "@/components/browse-species";
import ClassificationHeader from "@/components/classification-header";
import { DataNoteActions } from "@/components/data-note-actions";
import { DataTable, DataTableRow } from "@/components/data-table";
import { BarChart } from "@/components/graphing/bar";
import { TachoChart } from "@/components/graphing/tacho";
import { Attribute, DataField } from "@/components/highlight-stack";
import { usePreviousPage } from "@/components/navigation-history";
import { PageCitation } from "@/components/page-citation";
import { gql, OperationVariables, useQuery } from "@apollo/client";
import { Box, Container, Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import * as Humanize from "humanize-plus";
import { usePathname } from "next/navigation";
import { use, useEffect } from "react";

const GET_SPECIES = gql`
  query TaxonSpecies(
    $rank: TaxonRank
    $canonicalName: String
    $datasetId: UUID
    $filters: [FilterItem]
    $page: Int
    $pageSize: Int
    $sort: SpeciesSort
    $sortDirection: SortDirection
  ) {
    browse: taxon(
      by: { classification: { rank: $rank, canonicalName: $canonicalName, datasetId: $datasetId } }
      filters: $filters
    ) {
      species(page: $page, pageSize: $pageSize, sort: $sort, sortDirection: $sortDirection) {
        total
        records {
          taxonomy {
            canonicalName
            status
            vernacularGroup
            source
            sourceUrl
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

const DOWNLOAD_SPECIES = gql`
  query DownloadTaxonSpecies($rank: TaxonRank, $canonicalName: String, $datasetId: UUID, $filters: [FilterItem]) {
    download: taxon(
      by: { classification: { rank: $rank, canonicalName: $canonicalName, datasetId: $datasetId } }
      filters: $filters
    ) {
      csv: speciesCsv
    }
  }
`;

export interface TaxonResult extends Taxon {
  lowerRankSummary: RankSummary;
  speciesRankSummary: RankSummary;
}

type TaxonQuery = { taxon: TaxonResult };

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

const DOWNLOAD_SUMMARY = gql`
  query DownloadTaxonSummary($rank: TaxonRank, $canonicalName: String, $datasetId: UUID, $lowerRank: TaxonRank) {
    summary: taxon(by: { classification: { rank: $rank, canonicalName: $canonicalName, datasetId: $datasetId } }) {
      overview: summaryCsv(rank: $lowerRank)

      speciesGenomicDataSummaryCsv

      speciesGenomesSummaryCsv
    }

    stats {
      completeGenomesByYearCsv(taxonRank: $rank, taxonCanonicalName: $canonicalName)
    }
  }
`;

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

function DataSummary({
  rank,
  taxon,
  downloadVariables,
}: {
  rank: string;
  taxon: TaxonResult | undefined;
  downloadVariables: OperationVariables;
}) {
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
          <Stack data-downloadname="Aggregated total species" h="100%" justify="space-between">
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
          <Grid.Col data-downloadname="Complete genomes for representative species" span={12}>
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
              <Grid.Col data-downloadname="Percentage of species with genomes" span={collapsable(4)}>
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
              <Grid.Col data-downloadname="Species with genomes" span={collapsable(8)}>
                <Stack>
                  <Text fz="sm" fw={300}>
                    Species with genomes
                  </Text>
                  {speciesGenomes && <BarChart h={200} data={speciesGenomes.slice(0, 8)} spacing={0.1} />}
                </Stack>
              </Grid.Col>
              <Grid.Col data-downloadname="Percentage of species with any genetic data" span={collapsable(4)}>
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
              <Grid.Col data-downloadname="Species with any genetic data" span={collapsable(8)}>
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
            <DataNoteActions
              query={{
                name: taxon?.canonicalName.toLocaleLowerCase() || "taxon",
                download: DOWNLOAD_SUMMARY,
                fields: [
                  {
                    key: "summary.overview",
                    name: "overview-summary",
                  },
                  {
                    key: "summary.speciesGenomicDataSummaryCsv",
                    name: "species-genomic-data-summary",
                  },
                  {
                    key: "summary.speciesGenomesSummaryCsv",
                    name: "species-genomes-summary",
                  },
                  {
                    key: "stats.completeGenomesByYearCsv",
                    name: "complete-genomes-by-year",
                  },
                ],
                variables: downloadVariables,
              }}
            />
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
  const lowerRank = CLASSIFICATIONS_CHILD_MAP[rank]?.toUpperCase() || "";

  const { names } = useDatasets();
  const datasetId = names.get("Atlas of Living Australia")?.id;
  const variables = {
    rank,
    datasetId,
    canonicalName: params.name,
    lowerRank,
  };

  const pathname = usePathname();
  const [_, setPreviousPage] = usePreviousPage();

  const taxonResults = useQuery<TaxonQuery>(GET_TAXON, {
    variables,
  });

  useEffect(() => {
    setPreviousPage({ name: `browsing ${params.name}`, url: pathname });
  }, [params.name, pathname, setPreviousPage]);

  return (
    <Stack mt="xl">
      <ClassificationHeader rank={rank} classification={params.name} taxon={taxonResults.data?.taxon} />

      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Stack>
            <Paper p="xl" radius="lg" pos="relative" withBorder>
              {taxonResults.called && (
                <DataSummary rank={rank} taxon={taxonResults.data?.taxon} downloadVariables={variables} />
              )}
            </Paper>

            {datasetId && (
              <Paper p="xl" radius="lg" pos="relative" withBorder>
                <BrowseSpecies
                  query={{
                    content: GET_SPECIES,
                    download: DOWNLOAD_SPECIES,
                    variables: { rank, canonicalName: params.name, datasetId },
                  }}
                />
              </Paper>
            )}
          </Stack>
        </Container>
      </Paper>
      <PageCitation />
    </Stack>
  );
}
