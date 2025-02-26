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
import { gql, useQuery } from "@apollo/client";
import { TaxonomicRankStatistic } from "@/queries/stats";
import { CumulativeTracker } from "./_components/cumulative-tracker";
import { GroupingCompletionButton } from "./_components/grouping-completion";

const DATA = [
  {
    key: "domain",
    label: "Domain",
    value: 1,
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
    value: 5,
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
    value: 52,
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
    value: 153,
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
    value: 1025,
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
    value: 5878,
  },
  {
    key: "genus",
    label: "Genus",
    value: 45123,
  },
  {
    key: "species",
    label: "Species",
    value: 175099,
  },
];

export type SummaryDataType = typeof DATA;

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

const GET_TAXONOMIC_RANK_STATS = gql`
  query TaxonTreeStats($ranks: [TaxonomicRank]) {
    stats {
      taxonomicRanks(ranks: $ranks) {
        rank
        children
        coverage
        atLeastOne
      }
    }
  }
`;

type TaxonomicRankStatsQuery = {
  stats: {
    taxonomicRanks: TaxonomicRankStatistic[];
  };
};

export default function GenomeTracker() {
  const { data } = useQuery<TaxonomicRankStatsQuery>(GET_TAXONOMIC_RANK_STATS, {
    variables: {
      ranks: ["DOMAIN", "KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
    },
  });

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
            <Paper p="md" radius="lg" withBorder>
              <Stack>
                <Paper p="lg" radius="lg" withBorder>
                  <Stack gap="xl">
                    <Grid gutter="xl">
                      <GridCol span={4}>
                        <Stack h="100%" justify="space-between">
                          <Text size="lg" fw="bold">
                            Taxonomic composition of Australia&apos;s biodiversity
                          </Text>
                          {data && <GenomeComposition data={data.stats.taxonomicRanks} />}
                        </Stack>
                      </GridCol>
                      <GridCol span={8}>
                        <Text size="lg" fw="bold">
                          Cumulative tracker
                        </Text>
                        <Text mb="lg">
                          Percentage of taxonomic group coverage, where there is a complete genome for at least one
                          representative species from each grouping. Statistics based on records indexed within ARGA;
                          database last updated dd/mm/yy.
                        </Text>
                        <Box h={390}>{data && <CumulativeTracker data={data.stats.taxonomicRanks} />}</Box>
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
                            {DATA.map((step) => (
                              <StepperStep
                                icon={<IconCircleCheck size={36} color="lightgrey" />}
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
                              For the purposes of these data summaries, a “whole genome” is interpreted as being an
                              entire assembly of the genome, with or without chromosome assemblies (i.e. assemblies
                              which are at least represented as “scaffold assemblies” in the NCBI GenBank Genomes
                              Database).
                            </Text>
                            <Text c="midnight.11" size="sm">
                              The higher classification of Australia&apos;s biodiversity is driven by the taxonomic
                              system managed by the Atlas of Living Australia. The Atlas of Living Australia hosts a
                              record of all of the species that appear on the Australian National Species List, and
                              services nationally agreed nomenclature for these species.
                            </Text>
                            <Text c="midnight.11" size="sm">
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
                <Paper p="md" radius="lg" withBorder>
                  <Stack>
                    <Text size="lg" fw="bold">
                      Completion of genome sequences for key biodiversity groupings:
                    </Text>

                    <Grid>
                      <GridCol span={2}>
                        <GroupingCompletionButton h={200} group="mammals" />
                      </GridCol>
                      <GridCol span={2}>
                        <GroupingCompletionButton h={200} group="birds" />
                      </GridCol>
                      <GridCol span={2}>
                        <GroupingCompletionButton h={200} group="reptiles" />
                      </GridCol>
                      <GridCol span={2}>
                        <GroupingCompletionButton h={200} group="corals" />
                      </GridCol>
                      <GridCol span={2}>
                        <GroupingCompletionButton h={200} group="amphibians" />
                      </GridCol>
                      <GridCol span={2}>
                        <GroupingCompletionButton h={200} group="insects" />
                      </GridCol>
                      <GridCol span={2}>
                        <GroupingCompletionButton h={200} group="molluscs" />
                      </GridCol>
                      <GridCol span={2}>
                        <GroupingCompletionButton h={200} group="fungi" />
                      </GridCol>
                      <GridCol span={2}>
                        <GroupingCompletionButton h={200} group="flowering-plants" />
                      </GridCol>
                    </Grid>
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
