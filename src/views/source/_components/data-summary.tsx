import { DataField } from "@/components/data-fields";
import { DataNoteActions } from "@/components/data-note-actions";
import { DataTable, DataTableRow } from "@/components/data-table";
import { FilterItem } from "@/components/filtering-redux/filters/common";
import { BarChart } from "@/components/graphing/bar";
import { TachoChart } from "@/components/graphing/tacho";
import { gql } from "@apollo/client";
import { Box, Flex, Grid, Paper, Stack, Text, Title } from "@mantine/core";
import * as Humanize from "humanize-plus";
import { Source } from "../page";
import { GenomeCompletion } from "./genome-completion";
import { TaxonomicDiversityGraph } from "./taxonomic-diversity-graph";

const DOWNLOAD_SUMMARY = gql`
  query DownloadSourceSummary($name: String, $filters: [FilterItem]) {
    summary: source(by: { name: $name }, filters: $filters) {
      overview: summaryCsv
      speciesGenomicDataSummaryCsv
      speciesGenomesSummaryCsv
      speciesLociSummaryCsv
      taxonomicDiversityCsv
    }

    stats {
      completeGenomesByYearForSourceCsv(name: $name)
    }
  }
`;

export function DataSummary({ source, filters }: { source?: Source; filters: FilterItem[] }) {
  const minDate = new Date("2007-01-01");
  const maxDate = new Date(`${new Date().getFullYear() + 5}-01-01`);

  const thresholds = [
    { name: "low", color: "#f47625", start: 0, end: 25 },
    { name: "decent", color: "#febb1e", start: 25, end: 75 },
    { name: "great", color: "#97bc5d", start: 75, end: 100 },
  ];

  const speciesGenomes = source?.speciesGenomesSummary
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

  const speciesLoci = source?.speciesLociSummary
    .filter((i) => i.loci > 0)
    .map((summary) => {
      const linkName = encodeURIComponent(summary.canonicalName.replaceAll(" ", "_"));
      return {
        name: summary.canonicalName || "",
        value: summary.loci,
        href: `/species/${linkName}`,
      };
    })
    .sort((a, b) => b.value - a.value);

  const speciesOther = source?.speciesGenomicDataSummary
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

  const genomePercentile = source && (source.speciesRankSummary.genomes / source.speciesRankSummary.total) * 100;
  const lociPercentile = source && (source.speciesRankSummary.loci / source.speciesRankSummary.total) * 100;
  const otherPercentile = source && (source.speciesRankSummary.genomicData / source.speciesRankSummary.total) * 100;

  function collapsable(span: number) {
    return { base: span, xs: 12, sm: 12, md: span, lg: span, xl: span };
  }

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={5}>Data summary</Title>
      </Grid.Col>
      <Grid.Col span={12}>
        <Paper radius="lg" p="xl" withBorder>
          <Stack>
            <Text fw={300} size="sm">
              Taxonomic diversity of this dataset
            </Text>
            <Box h={280}>
              <TaxonomicDiversityGraph data={source?.taxonomicDiversity || []} />
            </Box>
          </Stack>
        </Paper>
      </Grid.Col>
      <Grid.Col span={12}>
        <Flex gap="md" align="stretch">
          <Box style={{ flexGrow: 1, minWidth: 0 }}>
            <Paper h={560} p="lg" radius="lg" withBorder style={{ display: "flex", flexDirection: "column" }}>
              <Stack data-downloadname="Aggregated total species" h="100%" justify="space-between">
                <Box style={{ flex: 1, minHeight: 0 }}>
                  <GenomeCompletion name={source?.name} filters={filters} domain={[minDate, maxDate]} />
                </Box>
                <Text fw={300} size="sm">
                  This graph shows the aggregated total of species for which a whole genome has been sequenced and made
                  available. The first instance of a whole genome sequence for an individual species has been plotted as
                  an accumulated total. Statistics based on records indexed within ARGA.
                </Text>
              </Stack>
            </Paper>
          </Box>

          <Box style={{ width: 320, flexShrink: 0 }}>
            <Paper h={560} p="xl" radius="lg" withBorder>
              <Title order={5}>Taxonomic breakdown</Title>

              <DataTable my={8} mx={-10}>
                <DataTableRow label="Species with genomes">
                  <DataField value={Humanize.formatNumber(source?.speciesRankSummary.genomes || 0)} />
                </DataTableRow>
                <DataTableRow label="Species with loci">
                  <DataField value={Humanize.formatNumber(source?.speciesRankSummary.loci || 0)} />
                </DataTableRow>
                <DataTableRow label="Species with data">
                  <DataField value={Humanize.formatNumber(source?.speciesRankSummary.genomicData || 0)} />
                </DataTableRow>
              </DataTable>
            </Paper>
          </Box>
        </Flex>
      </Grid.Col>
      <Grid.Col span={12}>
        <Grid mt="xl">
          <Grid.Col span={{ xs: 12, sm: 12, md: 8, lg: 9, xl: 10 }}>
            <Grid>
              <Grid.Col data-downloadname="Percentage of species with genomes" span={collapsable(4)}>
                <Stack>
                  <Text fz="sm" fw={300}>
                    Percentage of species with genomes
                  </Text>
                  {source && (
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
              <Grid.Col data-downloadname="Percentage of species with loci" span={collapsable(4)}>
                <Stack>
                  <Text fz="sm" fw={300}>
                    Percentage of species with loci
                  </Text>
                  {source && (
                    <TachoChart
                      mt={10}
                      h={150}
                      w={300}
                      thresholds={thresholds}
                      value={Math.round(lociPercentile || 0)}
                    />
                  )}
                </Stack>
              </Grid.Col>
              <Grid.Col data-downloadname="Species with loci" span={collapsable(8)}>
                <Stack>
                  <Text fz="sm" fw={300}>
                    Species with loci
                  </Text>
                  {speciesLoci && <BarChart h={200} data={speciesLoci.slice(0, 8)} spacing={0.1} />}
                </Stack>
              </Grid.Col>
              <Grid.Col data-downloadname="Percentage of species with any genetic data" span={collapsable(4)}>
                <Stack>
                  <Text fz="sm" fw={300}>
                    Percentage of species with any genetic data
                  </Text>
                  {source && (
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
                name: `${source?.name || "Source"} Summary`,
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
                    key: "summary.speciesLociSummaryCsv",
                    name: "species-genomes-summary",
                  },
                  {
                    key: "summary.taxonomicDiversityCsv",
                    name: "taxonomic-diversity",
                  },
                  {
                    key: "stats.completeGenomesByYearForSourceCsv",
                    name: "complete-genomes-by-year",
                  },
                ],
                variables: {
                  name: source?.name,
                  filters,
                },
              }}
            />
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
}
