"use client";

import { Box, Container, Grid, GridCol, Group, Paper, Stack, Text } from "@mantine/core";
import { gql } from "@apollo/client";

import { PreviousPage } from "@/components/navigation-history";

import { GenomeCompletion } from "./_components/genome-completion";
import { DataPageCitation } from "@/components/page-citation";
import { GenomeComposition } from "./_components/genome-composition";
import { CumulativeTracker } from "./_components/cumulative-tracker";
import { GroupingCompletion } from "./_components/grouping-completion";
import { SignificantMilestones } from "./_components/significant-milestones";
import { CompletionStepper } from "./_components/completion-stepper";
import { DataNoteActions } from "@/components/data-note-actions";

const DOWNLOAD_STATS = gql`
  query DownloadTrackerStats($taxonRank: TaxonomicRank, $taxonCanonicalName: String, $ranks: [TaxonomicRank]) {
    stats {
      completeGenomesByYearCsv(taxonRank: $taxonRank, taxonCanonicalName: $taxonCanonicalName)
      taxonomicRanksCsv(taxonRank: $taxonRank, taxonCanonicalName: $taxonCanonicalName, ranks: $ranks)
    }
  }
`;

export default function GenomeTracker() {
  const ranks = ["DOMAIN", "KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"];
  const minDate = new Date("2009-01-01");
  const maxDate = new Date(`${new Date().getFullYear() + 2}-01-01`);

  return (
    <>
      <Group p="lg">
        <PreviousPage />
      </Group>
      <Paper>
        <Container fluid p="xl">
          <Stack gap="lg">
            <Text c="midnight.11">
              Track progress towards sequencing the genomes of all of Australia&apos;s biodiversity species
            </Text>
            <Stack>
              <Paper p="lg" radius="lg" withBorder>
                <Stack gap="xl">
                  <Grid gutter="xl">
                    <GridCol data-downloadname="Genome Tracker Taxonomic Composition" span={5}>
                      <Stack h={570} justify="space-between">
                        <Text size="xl" fw="bold">
                          Taxonomic composition of Australia&apos;s biodiversity
                        </Text>
                        <GenomeComposition ranks={ranks} />
                      </Stack>
                    </GridCol>
                    <GridCol data-downloadname="Cumulative Tracker" span={5}>
                      <Stack gap={0}>
                        <Text size="xl" fw="bold">
                          Cumulative tracker
                        </Text>
                        <Text c="midnight.11" size="sm" mb="lg">
                          Percentage of taxonomic group coverage, where there is a complete genome for at least one
                          representative species from each grouping. Statistics based on records indexed within ARGA.
                        </Text>
                        <Box h={390} mt="lg" data-downloadname="Complete genome for one representative species">
                          <CumulativeTracker taxonRank="DOMAIN" taxonCanonicalName="Eukaryota" ranks={ranks} />
                        </Box>
                      </Stack>
                    </GridCol>
                    <GridCol span={2}>
                      <DataNoteActions
                        query={{
                          name: "genome-tracker",
                          download: DOWNLOAD_STATS,
                          fields: [
                            {
                              key: "stats.taxonomicRanksCsv",
                              name: "cumulative-tracker",
                            },
                            {
                              key: "stats.completeGenomesByYearCsv",
                              name: "complete-genomes-by-year",
                            },
                          ],
                          variables: {
                            taxonRank: "DOMAIN",
                            taxonCanonicalName: "Eukaryota",
                            ranks,
                          },
                        }}
                      />
                    </GridCol>
                    <GridCol span={12}>
                      <Stack gap="xl">
                        <Text size="xl" fw="bold">
                          There is a complete genome for at least one representative species from each:
                        </Text>
                        <CompletionStepper />
                      </Stack>
                    </GridCol>
                  </Grid>
                </Stack>
              </Paper>
              <Paper p="md" radius="lg" withBorder>
                <Stack>
                  <Text size="xl" fw="bold">
                    Rate of genome completion for Australian species over time
                  </Text>
                  <Text c="midnight.11" size="sm">
                    This graph shows the aggregated total of species for which a whole genome has been sequenced and
                    made available. The first instance of a whole genome sequence for an individual species has been
                    plotted as an accumulated total. Statistics based on records indexed within ARGA.
                  </Text>
                  <Box h={500} data-downloadname="Genome Completion for Australian Species">
                    <GenomeCompletion taxonRank="DOMAIN" taxonCanonicalName="Eukaryota" domain={[minDate, maxDate]} />
                  </Box>
                </Stack>
                <Stack my="xl" gap="xl">
                  <Text size="xl" fw="bold">
                    Significant milestones in the genome sequencing of Australia&apos;s biodiversity
                  </Text>
                  <SignificantMilestones />
                </Stack>
              </Paper>
              <Paper p="lg" radius="lg" withBorder>
                <Stack>
                  <Text size="xl" fw="bold">
                    Completion of genome sequences for key biodiversity groupings
                  </Text>
                  <GroupingCompletion dateDomain={[minDate, new Date()]} />
                </Stack>
              </Paper>
            </Stack>
            <DataPageCitation />
          </Stack>
        </Container>
      </Paper>
    </>
  );
}
