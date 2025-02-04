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
import { CumulativeTracker } from "./_components/cumulative-tracker";
import { ReactElement } from "react";
import { GenomeCompletion } from "./_components/genome-completion";
import { DataPageCitation } from "@/components/page-citation";
import { SunburstChart } from "./_components/sunburst";
import { GenomeComposition } from "./_components/genome-composition";
import { gql, useQuery } from "@apollo/client";
import { TaxonStatTreeNode } from "@/queries/stats";

const labels = [
  "1 Domain",
  "5 Kingdoms",
  "52 Phyla",
  "153 Classes",
  "1025 Orders",
  "5878 Families",
  "45123 Genera",
  "175099 Species",
];

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

const GET_TAXON_TREE_STATS = gql`
  query TaxonTreeStats(
    $taxonRank: TaxonomicRank
    $taxonCanonicalName: String
    $includeRanks: [TaxonomicRank]
  ) {
    stats {
      taxonBreakdown(
        taxonRank: $taxonRank
        taxonCanonicalName: $taxonCanonicalName
        includeRanks: $includeRanks
      ) {
        ...TaxonStatTreeNode

        # family children
        children {
          ...TaxonStatTreeNode

          # subfamily children
          children {
            ...TaxonStatTreeNode

            # genus children
            children {
              ...TaxonStatTreeNode

              # subgenus children
              children {
                ...TaxonStatTreeNode

                # species children
                children {
                  ...TaxonStatTreeNode

                  # subspecies children
                  children {
                    ...TaxonStatTreeNode

                    children {
                      ...TaxonStatTreeNode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

type TaxonTreeStatsQuery = {
  stats: {
    taxonBreakdown: TaxonStatTreeNode[];
  };
};

export default function GenomeTracker() {
  const { data } = useQuery<TaxonTreeStatsQuery>(GET_TAXON_TREE_STATS, {
    variables: {
      taxonRank: "DOMAIN",
      taxonCanonicalName: "Eukaryota",
      includeRanks: [
        "DOMAIN",
        "KINGDOM",
        "PHYLUM",
        "CLASS",
        "ORDER",
        "FAMILY",
        "GENUS",
        "SPECIES",
      ],
    },
  });

  console.log(data);

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
                        <Stack h="100%" justify="space-between">
                          <Text size="lg" fw="bold">
                            Taxonomic composition of Australia&apos;s
                            biodiversity
                          </Text>
                          <GenomeComposition data={DATA} />
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
                            {DATA.map((step) => (
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
                <Paper p="md" radius="lg" withBorder>
                  <Stack>
                    <Text size="lg" fw="bold">
                      Completion of genome sequences for key biodiversity
                      groupings:
                    </Text>
                    <SunburstChart />
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
