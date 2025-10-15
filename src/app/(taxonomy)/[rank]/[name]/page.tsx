"use client";

// Types
import { Dataset, RankSummary, Taxon } from "@/generated/types";

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
import {
  getChildRank,
  isLatin,
  latinilizeNormalRank,
  normalizeLatinRank,
  pluralizeRank,
} from "@/helpers/rankHelpers";
import { gql, type OperationVariables } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  Box,
  Container,
  Flex,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import * as Humanize from "humanize-plus";
import { use, useEffect, useMemo } from "react";

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

const GET_TAXON_DETAILS = gql`
  query TaxonDetails($rank: TaxonRank, $canonicalName: String, $datasetId: UUID) {
    taxon(by: { classification: { rank: $rank, canonicalName: $canonicalName, datasetId: $datasetId } }) {
      scientificName
      canonicalName
      authorship
      status
      rank
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
    }
  }
`;

const GET_TAXON_STATS = gql`
  query TaxonStats($rank: TaxonRank, $canonicalName: String, $datasetId: UUID, $lowerRank: TaxonRank) {
    taxon(by: { classification: { rank: $rank, canonicalName: $canonicalName, datasetId: $datasetId } }) {
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

function DataSummary({
  normalRank,
  rankDetails,
  taxon,
  downloadVariables,
}: {
  normalRank: string;
  rankDetails: TaxonRankDetails | null;
  taxon?: TaxonResult | null;
  downloadVariables: OperationVariables;
}) {
  // const childTaxon = getChildRank(normalRank.toLowerCase());
  const childTaxonLabel = rankDetails
    ? pluralizeRank(getChildRank(rankDetails.rank.toLowerCase())).toLowerCase()
    : null;

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
      const linkName = encodeURIComponent(
        summary.canonicalName.replaceAll(" ", "_"),
      );
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
      const linkName = encodeURIComponent(
        summary.canonicalName.replaceAll(" ", "_"),
      );
      return {
        name: summary.canonicalName || "",
        value: summary.totalGenomic,
        href: `/species/${linkName}`,
      };
    })
    .sort((a, b) => b.value - a.value);

  const genomePercentile =
    taxon &&
    (taxon.speciesRankSummary.genomes / taxon.speciesRankSummary.total) * 100;
  const otherPercentile =
    taxon &&
    (taxon.speciesRankSummary.genomicData / taxon.speciesRankSummary.total) *
    100;

  function collapsable(span: number) {
    return { base: span, xs: 12, sm: 12, md: span, lg: span, xl: span };
  }

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={5}>Data summary</Title>
      </Grid.Col>
      <Grid.Col span={12}>
        <Flex gap="md" align="stretch">
          <Box style={{ width: 430, flexShrink: 0 }}>
            <Paper px="lg" pb="lg" w={430} h={560} radius="lg" withBorder>
              <Stack h="100%" justify="space-between">
                <GroupDetailRadial
                  height={400}
                  radial={25}
                  query={{
                    taxonRank: normalRank,
                    taxonCanonicalName: taxon?.canonicalName || "",
                    includeRanks: [
                      normalRank,
                      ALL_RANKS[ALL_RANKS.indexOf(normalRank) + 1],
                    ],
                    rankStats: ALL_RANKS.slice(
                      ALL_RANKS.indexOf(normalRank) + 1,
                    ),
                  }}
                  fontSize={7}
                  switcherGap="sm"
                  switcherSize="sm"
                  hideDescription
                />
                <Text fw={300} size="sm">
                  Total of species for which a whole genome has been sequenced
                  and made available aggregated by higher classification units.
                </Text>
              </Stack>
            </Paper>
          </Box>
          <Box style={{ flexGrow: 1, minWidth: 0 }}>
            <Paper h={560} p="lg" radius="lg" withBorder>
              <Stack
                data-downloadname="Aggregated total species"
                h="100%"
                justify="space-between"
              >
                <Box h={400}>
                  <GenomeCompletion
                    taxonRank={normalRank}
                    taxonCanonicalName={taxon?.canonicalName || ""}
                    domain={[minDate, maxDate]}
                  />
                </Box>
                <Text fw={300} size="sm">
                  This graph shows the aggregated total of species for which a
                  whole genome has been sequenced and made available. The first
                  instance of a whole genome sequence for an individual species
                  has been plotted as an accumulated total. Statistics based on
                  records indexed within ARGA.
                </Text>
              </Stack>
            </Paper>
          </Box>
          <Box style={{ width: 360, flexShrink: 0 }}>
            <Paper h={560} p="xl" radius="lg" withBorder>
              <Title order={5}>Taxonomic breakdown</Title>

              <DataTable my={8}>
                {normalRank !== "GENUS" && (
                  <DataTableRow
                    label={`Number of ${childTaxonLabel || "unknown"}`}
                  >
                    <DataField
                      value={taxon?.lowerRankSummary?.total}
                    ></DataField>
                  </DataTableRow>
                )}
                <DataTableRow label="Number of species/OTUs">
                  <DataField
                    value={Humanize.formatNumber(
                      taxon?.speciesRankSummary.total || 0,
                    )}
                  />
                </DataTableRow>
                {normalRank !== "GENUS" && (
                  <DataTableRow
                    label={`${Humanize.capitalize(childTaxonLabel || "unknown")} with genomes`}
                  >
                    <DataField
                      value={Humanize.formatNumber(
                        taxon?.lowerRankSummary?.genomes || 0,
                      )}
                    />
                  </DataTableRow>
                )}
                <DataTableRow label="Species with genomes">
                  <DataField
                    value={Humanize.formatNumber(
                      taxon?.speciesRankSummary.genomes || 0,
                    )}
                  />
                </DataTableRow>
                {normalRank !== "GENUS" && (
                  <DataTableRow
                    label={`${Humanize.capitalize(childTaxonLabel || "unknown")} with data`}
                  >
                    <DataField
                      value={Humanize.formatNumber(
                        taxon?.lowerRankSummary.genomicData || 0,
                      )}
                    />
                  </DataTableRow>
                )}
                <DataTableRow label="Species with data">
                  <DataField
                    value={Humanize.formatNumber(
                      taxon?.speciesRankSummary.genomicData || 0,
                    )}
                  />
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
          </Box>
        </Flex>
      </Grid.Col>

      <Grid.Col span={12}>
        <Grid mt="xl">
          <Grid.Col
            data-downloadname="Complete genomes for representative species"
            span={12}
          >
            <Stack>
              <Text fz="sm" fw={300}>
                Complete genome for at least one representative species from
                each:
              </Text>
              <Group grow px="lg">
                <CompletionStepper
                  rank={normalRank}
                  canonicalName={taxon?.canonicalName}
                />
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ xs: 12, sm: 12, md: 8, lg: 9, xl: 10 }}>
            <Grid>
              <Grid.Col
                data-downloadname="Percentage of species with genomes"
                span={collapsable(4)}
              >
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
              <Grid.Col
                data-downloadname="Species with genomes"
                span={collapsable(8)}
              >
                <Stack>
                  <Text fz="sm" fw={300}>
                    Species with genomes
                  </Text>
                  {speciesGenomes && (
                    <BarChart
                      h={200}
                      data={speciesGenomes.slice(0, 8)}
                      spacing={0.1}
                    />
                  )}
                </Stack>
              </Grid.Col>
              <Grid.Col
                data-downloadname="Percentage of species with any genetic data"
                span={collapsable(4)}
              >
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
              <Grid.Col
                data-downloadname="Species with any genetic data"
                span={collapsable(8)}
              >
                <Stack>
                  <Text fz="sm" fw={300}>
                    Species with any genetic data
                  </Text>
                  {speciesOther && (
                    <BarChart
                      h={200}
                      data={speciesOther.slice(0, 8)}
                      spacing={0.1}
                    />
                  )}
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

interface TaxonRankDetails {
  latin: boolean;
  normalRank: string;
  latinRank: string;
  rank: string;
}
interface ClassificationPageProps {
  params: Promise<{
    rank: string;
    name: string;
  }>;
}

const ALL_RANKS = [
  "DOMAIN",
  "KINGDOM",
  "PHYLUM",
  "CLASS",
  "ORDER",
  "FAMILY",
  "GENUS",
  "SPECIES",
];

export default function ClassificationPage(props: ClassificationPageProps) {
  const { rank: rawRank, name } = use(props.params);
  const normalRank = normalizeLatinRank(rawRank).toUpperCase();
  const lowerRank = getChildRank(normalRank).toUpperCase() || "";

  const { names } = useDatasets();
  const dataset = names.get("Atlas of Living Australia") as Dataset | undefined;
  const datasetId = dataset?.id;
  const variables = {
    rank: normalRank,
    datasetId,
    canonicalName: name,
    lowerRank,
  };

  const [_, setPreviousPage] = usePreviousPage();

  const taxonDetailsResults = useQuery<TaxonQuery>(GET_TAXON_DETAILS, {
    variables,
    skip: !datasetId,
  });

  const taxonStatsResults = useQuery<TaxonQuery>(GET_TAXON_STATS, {
    variables,
    skip: !datasetId || taxonDetailsResults.loading,
  });

  const taxonRank: TaxonRankDetails | null = useMemo(() => {
    if (taxonDetailsResults.data) {
      const { taxon } = taxonDetailsResults.data;
      const latin = isLatin(taxon);
      const normalRank = normalizeLatinRank(taxon.rank);
      const latinRank = latinilizeNormalRank(taxon.rank);
      const rank = (latin ? latinRank : normalRank).toLowerCase();

      return {
        latin,
        normalRank,
        latinRank,
        rank,
      };
    }

    return null;
  }, [taxonDetailsResults.data]);

  // Correct taxonomy redirect
  useEffect(() => {
    if (taxonRank) {
      // If this taxon is latin but the supplied rank isn't (or vice versa), correct the URL
      if (taxonRank.latin && rawRank.toLowerCase() !== taxonRank.rank) {
        window.history.replaceState(null, "", `/${taxonRank.rank}/${name}`);
      }
    }
  }, [taxonRank]);

  // Set previous page
  useEffect(() => {
    if (taxonRank) {
      setPreviousPage({
        name: `browsing ${name}`,
        url: `/${taxonRank.rank}/${name}`,
      });
    }
  }, [name, taxonRank, setPreviousPage]);

  return (
    <Stack mt="xl" gap={0}>
      <ClassificationHeader
        rawRank={rawRank}
        taxon={taxonDetailsResults?.data?.taxon}
        dataset={dataset}
      />
      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Stack>
            <Paper p="xl" radius="lg" pos="relative" withBorder>
              <DataSummary
                normalRank={normalRank}
                rankDetails={taxonRank}
                taxon={
                  taxonStatsResults.data && taxonDetailsResults.data
                    ? {
                      ...taxonStatsResults.data.taxon,
                      ...taxonDetailsResults.data?.taxon,
                    }
                    : null
                }
                downloadVariables={variables}
              />
            </Paper>
            {datasetId && (
              <Paper p="xl" radius="lg" pos="relative" withBorder>
                <BrowseSpecies
                  query={{
                    content: GET_SPECIES,
                    download: DOWNLOAD_SPECIES,
                    variables: {
                      rank: normalRank,
                      canonicalName: name,
                      datasetId,
                    },
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
