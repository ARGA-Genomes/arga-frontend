"use client";

import {
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";

import { PreviousPage } from "@/components/navigation-history";

import { IconCopy, IconDownload } from "@tabler/icons-react";
import { ReactElement } from "react";
import { GenomeCompletion } from "./_components/genome-completion";
import { DataPageCitation } from "@/components/page-citation";
import { GenomeComposition } from "./_components/genome-composition";
import { CumulativeTracker } from "./_components/cumulative-tracker";
import { GroupingCompletion } from "./_components/grouping-completion";
import { SignificantMilestones } from "./_components/significant-milestones";
import { CompletionStepper } from "./_components/completion-stepper";

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

export default function GenomeTracker() {
  const ranks = ["DOMAIN", "KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"];
  const minDate = new Date("2009-01-01");
  const maxDate = new Date(`${new Date().getFullYear() + 10}-01-01`);

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
                    <GridCol span={5}>
                      <Stack h={570} justify="space-between">
                        <Text size="lg" fw="bold">
                          Taxonomic composition of Australia&apos;s biodiversity
                        </Text>
                        <GenomeComposition ranks={ranks} />
                      </Stack>
                    </GridCol>
                    <GridCol span={5}>
                      <Text size="lg" fw="bold">
                        Cumulative tracker
                      </Text>
                      <Text c="midnight.11" size="sm" mb="lg">
                        Percentage of taxonomic group coverage, where there is a complete genome for at least one
                        representative species from each grouping. Statistics based on records indexed within ARGA.
                      </Text>
                      <Box h={390}>
                        <CumulativeTracker taxonRank="DOMAIN" taxonCanonicalName="Eukaryota" ranks={ranks} />
                      </Box>
                    </GridCol>
                    <GridCol span={2}>
                      <Paper radius="lg" p="md" withBorder>
                        <Stack>
                          <Text c="midnight.9" size="xs" fw="bold">
                            Note:
                          </Text>
                          <Text c="midnight.11" size="xs">
                            For the purposes of these data summaries, a “whole genome” is interpreted as being an entire
                            assembly of the genome, with or without chromosome assemblies (i.e. assemblies which are at
                            least represented as “scaffold assemblies” in the NCBI GenBank Genomes Database).
                          </Text>
                          <Text c="midnight.11" size="xs">
                            The higher classification of Australia&apos;s biodiversity is driven by the taxonomic system
                            managed by the Atlas of Living Australia. The Atlas of Living Australia hosts a record of
                            all of the species that appear on the Australian National Species List, and services
                            nationally agreed nomenclature for these species.
                          </Text>
                          <Text c="midnight.11" size="xs">
                            The data used to generate the page statistics and graphics are accurate to dd/mm/yy. Data
                            and graphics on this page may be shared under a CC BY 4.0 licence.
                          </Text>
                          <Divider my="xs" />
                          <Stack>
                            <ActionButton label="Copy page citation" icon={<IconCopy size="1rem" />} />
                            <ActionButton label="Download raw data as CSV" icon={<IconDownload size="1rem" />} />
                            <ActionButton label="Download graphics as PNG file" icon={<IconDownload size="1rem" />} />
                          </Stack>
                        </Stack>
                      </Paper>
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
                    Rate of genome completion for Australian species over time:
                  </Text>
                  <Text c="midnight.11" size="sm">
                    This graph shows the aggregated total of species for which a whole genome has been sequenced and
                    made available. The first instance of a whole genome sequence for an individual species has been
                    plotted as an accumulated total. Statistics based on records indexed within ARGA.
                  </Text>
                  <Box h={500}>
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
                  <Text size="lg" fw="bold">
                    Completion of genome sequences for key biodiversity groupings:
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
