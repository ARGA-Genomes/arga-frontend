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
  Stepper,
  StepperStep,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";

import { PreviousPage } from "@/components/navigation-history";

import stepperClasses from "./stepper.module.css";
import { IconCircleCheck, IconCopy, IconDownload } from "@tabler/icons-react";
import { ReactElement } from "react";
import { GenomeCompletion } from "./_components/genome-completion";
import { DataPageCitation } from "@/components/page-citation";
import { GenomeComposition } from "./_components/genome-composition";
import { CumulativeTracker } from "./_components/cumulative-tracker";
import { GroupingCompletion } from "./_components/grouping-completion";

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
                          <Group>
                            <ActionButton label="Copy page citation" icon={<IconCopy size="1rem" />} />
                            <ActionButton label="Download raw data as CSV" icon={<IconDownload size="1rem" />} />
                            <ActionButton label="Download graphics as PNG file" icon={<IconDownload size="1rem" />} />
                          </Group>
                        </Stack>
                      </Paper>
                    </GridCol>
                    <GridCol span={12}>
                      <Stack gap="xl">
                        <Text size="xl" fw="bold">
                          There is a complete genome for at least one representative species from each:
                        </Text>
                        <Stepper
                          classNames={stepperClasses}
                          completedIcon={<IconCircleCheck size={32} />}
                          color="moss"
                          active={3}
                        >
                          <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Domain" />
                          <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Kingdom" />
                          <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Phylum" />
                          <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Class" />
                          <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Order" />
                          <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Family" />
                          <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Genus" />
                          <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Species" />
                        </Stepper>
                      </Stack>
                    </GridCol>
                  </Grid>
                </Stack>
              </Paper>
              <Paper p="md" radius="lg" withBorder>
                <Stack>
                  <Text size="lg" fw="bold">
                    Rate of genome completion over time:
                  </Text>
                  <Box h={500}>
                    <GenomeCompletion taxonRank="DOMAIN" taxonCanonicalName="Eukaryota" />
                  </Box>
                </Stack>
              </Paper>
              <Paper p="lg" radius="lg" withBorder>
                <Stack>
                  <Text size="lg" fw="bold">
                    Completion of genome sequences for key biodiversity groupings:
                  </Text>
                  <GroupingCompletion />
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
