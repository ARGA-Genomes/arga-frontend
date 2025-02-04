import {
  Anchor,
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
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
import { CumulativeTracker } from "./_components/cumulative-tracker";
import { ReactElement } from "react";
import { GenomeCompletion } from "./_components/genome-completion";
import { DataPageCitation } from "@/components/page-citation";

const COMPLETE_GENOME_STEPS = [
  {
    key: "domain",
    label: "Domain",
  },
  {
    key: "kingdom",
    label: (
      <>
        Kingdom
        <br />
        (or Regnum)
      </>
    ),
  },
  {
    key: "phylum",
    label: (
      <>
        Phylum
        <br />
        (or Divison)
      </>
    ),
  },
  {
    key: "class",
    label: (
      <>
        Class
        <br />
        (or Classis)
      </>
    ),
  },
  {
    key: "order",
    label: (
      <>
        Order
        <br />
        (or Ordo)
      </>
    ),
  },
  {
    key: "family",
    label: (
      <>
        Family
        <br />
        (or Familia)
      </>
    ),
  },
  {
    key: "genus",
    label: "Genus",
  },
  {
    key: "species",
    label: "Species",
  },
];

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
        <Text size="sm" fw={600} color="midnight.11">
          {label}
        </Text>
      </Flex>
    </UnstyledButton>
  );
}

export default function GenomeTracker() {
  return (
    <>
      <Group p="lg">
        <PreviousPage />
      </Group>
      <Paper>
        <Container fluid p="xl">
          <Stack gap="lg">
            <Text c="midnight.11">
              Track progress towards sequencing the genomes of all of
              Australia&apos;s biodiversity species
            </Text>
            <Paper p="md" radius="lg" withBorder>
              <Stack>
                <Paper p="lg" radius="lg" withBorder>
                  <Stack gap="xl">
                    <Grid gutter="xl">
                      <GridCol span={4}>
                        <Stack h="100%" justify="space-between" pb="xl">
                          <Text size="lg" fw="bold">
                            Taxonomic composition of Australia&apos;s
                            biodiversity
                          </Text>
                          <Image
                            fit="contain"
                            mah={350}
                            width="auto"
                            src="/pyramid.png"
                            alt="Pyramid"
                          />
                        </Stack>
                      </GridCol>
                      <GridCol span={8}>
                        <Text size="lg" fw="bold">
                          Cumulative tracker
                        </Text>
                        <Text mb="lg">
                          Percentage of taxonomic group coverage, where there is
                          a complete genome for at least one representative
                          species from each grouping. Statistics based on
                          records indexed within ARGA; database last updated
                          dd/mm/yy.
                        </Text>
                        <Box h={390}>
                          <CumulativeTracker />
                        </Box>
                      </GridCol>
                      <GridCol span={12}>
                        <Stack gap="xl">
                          <Text size="xl" fw="bold">
                            There is a complete genome for at least one
                            representative species from each:
                          </Text>
                          <Stepper
                            classNames={stepperClasses}
                            completedIcon={<IconCircleCheck size={32} />}
                            color="moss"
                            active={3}
                          >
                            {COMPLETE_GENOME_STEPS.map((step) => (
                              <StepperStep
                                icon={
                                  <IconCircleCheck
                                    size={36}
                                    color="lightgrey"
                                  />
                                }
                                key={step.key}
                                label={step.label}
                              />
                            ))}
                          </Stepper>
                        </Stack>
                      </GridCol>
                      <GridCol span={12}>
                        <Paper radius="lg" p="md" withBorder>
                          <Stack>
                            <Text c="midnight.9" size="sm" fw="bold">
                              Note:
                            </Text>
                            <Text c="midnight.11" size="sm">
                              For the purposes of these data summaries, a “whole
                              genome” is interpreted as being an entire assembly
                              of the genome, with or without chromosome
                              assemblies (i.e. assemblies which are at least
                              represented as “scaffold assemblies” in the NCBI
                              GenBank Genomes Database).
                            </Text>
                            <Text c="midnight.11" size="sm">
                              The higher classification of Australia&apos;s
                              biodiversity is driven by the taxonomic system
                              managed by the Atlas of Living Australia. The
                              Atlas of Living Australia hosts a record of all of
                              the species that appear on the Australian National
                              Species List, and services nationally agreed
                              nomenclature for these species.
                            </Text>
                            <Text c="midnight.11" size="sm">
                              The data used to generate the page statistics and
                              graphics are accurate to dd/mm/yy. Data and
                              graphics on this page may be shared under a CC BY
                              4.0 licence.
                            </Text>
                            <Divider my="xs" />
                            <Group>
                              <ActionButton
                                label="Copy page citation"
                                icon={<IconCopy size="1rem" />}
                              />
                              <ActionButton
                                label="Download raw data as CSV"
                                icon={<IconDownload size="1rem" />}
                              />
                              <ActionButton
                                label="Download graphics as PNG file"
                                icon={<IconDownload size="1rem" />}
                              />
                            </Group>
                          </Stack>
                        </Paper>
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
                      <GenomeCompletion />
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Paper>
            <DataPageCitation />
          </Stack>
        </Container>
      </Paper>
    </>
  );
}
