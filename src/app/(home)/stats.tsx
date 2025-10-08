"use client";
// Types
import { DataBreakdown, RankSummary } from "@/generated/types";

// Imports
import { DataTable, DataTableRow } from "@/components/data-table";
import { BarChart } from "@/components/graphing/bar";
import { TachoChart } from "@/components/graphing/tacho";
import { DataField } from "@/components/highlight-stack";
import { LoadOverlay } from "@/components/load-overlay";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Box, Grid, Paper, Stack, Text, Title } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import * as Humanize from "humanize-plus";
import Link from "next/link";
import { useDatasets } from "../source-provider";
import classes from "./stats.module.css";

const GET_TAXON = gql`
  query HomeStats($datasetId: UUID) {
    taxon(by: { classification: { rank: DOMAIN, canonicalName: "Eukaryota", datasetId: $datasetId } }) {
      speciesSummary: summary(rank: SPECIES) {
        total
        genomes
        genomicData
      }

      speciesGenomesSummary {
        canonicalName
        genomes
        totalGenomic
      }
    }
  }
`;

interface TaxonResults {
  taxon: {
    speciesSummary: RankSummary;
    speciesGenomesSummary: DataBreakdown[];
  };
}

export function ShowStats() {
  const { names } = useDatasets();
  const datasetId = names.get("Atlas of Living Australia")?.id;

  const taxonResults = useQuery<TaxonResults>(GET_TAXON, {
    variables: {
      datasetId,
    },
  });

  const taxon = taxonResults.data?.taxon;

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

  const genomePercentile = taxon && (taxon.speciesSummary.genomes / taxon.speciesSummary.total) * 100;

  return (
    <Paper
      component={Link}
      href="/genome-tracker"
      className={classes.stats}
      pos="relative"
      radius="lg"
      style={{ width: 640, height: 608 }}
    >
      <Box className={classes.message}>
        <IconArrowUpRight size="2.4rem" />
        <Text style={{ fontSize: 28 }} fw={600}>
          Go to Genome Tracker
        </Text>
        <Text size="lg">Track progress for Australian biodiversity genomics</Text>
      </Box>
      <LoadOverlay visible={taxonResults.loading} />
      <Grid p={20}>
        <Grid.Col span={12}>
          <Title order={4}>Data summary</Title>
        </Grid.Col>
        <Grid.Col span={6} mb={10}>
          <Stack gap="sm">
            <Title order={6}>Percentage of species with genomes</Title>
            {taxon && <TachoChart h={115} thresholds={thresholds} value={Math.round(genomePercentile || 0)} />}
          </Stack>
        </Grid.Col>

        <Grid.Col span={6} mb={10}>
          <Stack gap="sm">
            <Title order={6}>Taxonomic breakdown</Title>

            <DataTable my={2}>
              <DataTableRow label="Number of species/OTUs">
                <DataField value={Humanize.formatNumber(taxon?.speciesSummary.total || 0)} />
              </DataTableRow>

              <DataTableRow label="Species with genomes">
                <DataField value={Humanize.formatNumber(taxon?.speciesSummary.genomes || 0)} />
              </DataTableRow>

              <DataTableRow label="Species with data">
                <DataField value={Humanize.formatNumber(taxon?.speciesSummary.genomicData || 0)} />
              </DataTableRow>
            </DataTable>
          </Stack>
        </Grid.Col>

        <Grid.Col span={12} pt={10}>
          <Stack>
            <Title order={6}>Species with genomes</Title>
            {speciesGenomes && <BarChart h={250} data={speciesGenomes.slice(0, 10)} spacing={0.1} labelWidth={200} />}
          </Stack>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text fz={10} c="midnight.6">
            Note: these statistics summarise the content indexed within ARGA. The values relate to the species deemed
            relevant to Australia (either by endemicity or economic and social value), and for repositories that are
            indexed by ARGA. The values may not be indicative of global values for all research.
          </Text>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
