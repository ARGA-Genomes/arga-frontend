"use client";

import { Attribute, DataField } from "@/components/highlight-stack";
import { DataTable, DataTableRow } from "@/components/data-table";
import { TachoChart } from "@/components/graphing/tacho";
import { gql, useQuery } from "@apollo/client";
import { Grid, Paper, Stack, Title, Text } from "@mantine/core";
import * as Humanize from 'humanize-plus';
import { BarChart } from "@/components/graphing/bar";
import { LoadOverlay } from "@/components/load-overlay";

const GET_TAXON = gql`
query HomeStats {
  taxon(rank: DOMAIN, canonicalName: "Eukaryota") {
    summary {
      species
      speciesData
      speciesGenomes
    }

    speciesSummary {
      name
      genomes
      totalGenomic
    }

    speciesGenomeSummary {
      name
      genomes
      totalGenomic
    }
  }
}`;

type DataBreakdown = {
  name: string,
  genomes: number,
  totalGenomic: number,
}

type Taxonomy = {
  dataSummary: DataBreakdown[]
  speciesSummary: DataBreakdown[]
  speciesGenomeSummary: DataBreakdown[]
  summary: {
    children: number,
    childrenData: number,
    childrenGenomes: number
    species: number,
    speciesData: number,
    speciesGenomes: number,
  }
};

type TaxonResults = {
  taxon: Taxonomy,
}


export default function ShowStats() {
  const taxonResults = useQuery<TaxonResults>(GET_TAXON);
  const taxon = taxonResults.data?.taxon

  const thresholds = [
    { name: "low", color: "#f47625", start: 0, end: 50 },
    { name: "decent", color: "#febb1e", start: 50, end: 75 },
    { name: "great", color: "#97bc5d", start: 75, end: 100 },
  ]

  const speciesGenomes = taxon?.speciesGenomeSummary.filter(i => i.genomes > 0).map(summary => {
    const linkName = encodeURIComponent(summary.name.replaceAll(' ', '_'));
    return {
      name: summary.name || '',
      value: summary.genomes,
      href: `/species/${linkName}`,
    }
  }).sort((a, b) => b.value - a.value)

  const genomePercentile = taxon && (taxon.summary.speciesGenomes / taxon.summary.species) * 100;

  return (
    <Paper radius="20px" mr={50} style={{ position: "absolute", top: 200, right: 0, width: "650px" }}>
      <LoadOverlay visible={taxonResults.loading} />
      <Grid p={20}>
        <Grid.Col span={6} mb={10}>
          <Title order={5}>Data summary</Title>
          <Stack>
            <Text fz="sm" fw={300}>Percentage of species with genomes</Text>
            {taxon && <TachoChart h={130} thresholds={thresholds} value={Math.round(genomePercentile || 0)} />}
          </Stack>
        </Grid.Col>

        <Grid.Col span={6} mb={10}>
          <Title order={5}>Taxonomic breakdown</Title>

          <DataTable my={2}>

            <DataTableRow label="Number of species/OTUs">
              <DataField value={Humanize.formatNumber(taxon?.summary.species || 0)} />
            </DataTableRow>

            <DataTableRow label="Species with genomes">
              <DataField value={Humanize.formatNumber(taxon?.summary.speciesGenomes || 0)} />
            </DataTableRow>

            <DataTableRow label="Species with data">
              <DataField value={Humanize.formatNumber(taxon?.summary.speciesData || 0)} />
            </DataTableRow>
          </DataTable>

          <Stack mx={10} mt={5}>
            <Attribute
              label="Species with most genomes"
              value={speciesGenomes && speciesGenomes[0]?.name}
              href={`/species/${speciesGenomes && speciesGenomes[0]?.name?.replaceAll(' ', '_')}/taxonomy`}
            />
          </Stack>
        </Grid.Col>

        <Grid.Col span={12}>
          <Stack>
            <Text fz="sm" fw={300}>Species with genomes</Text>
            {speciesGenomes && <BarChart h={250} data={speciesGenomes.slice(0, 10)} spacing={0.1} labelWidth={200} />}
          </Stack>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text fz="xs" fw={300}>Note: these statistics summarise the content indexed within ARGA.  The values relate to the species deemed relevant to Australia (either by endemicity or economic and social value), and for repositories that are indexed by ARGA.  The values may not be indicative of global values for all research.</Text>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}
