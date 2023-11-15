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
query TaxonSpecies($rank: TaxonRank, $canonicalName: String) {
  taxon(rank: $rank, canonicalName: $canonicalName) {
    summary {
      children
      species
    }

    dataSummary {
      name
      genomes
      totalGenomic
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
        species: number,
    }
};

type TaxonResults = {
    taxon: Taxonomy,
}


export default function ShowStats({ rank, name }: { rank: string, name: String }) {
    const taxonResults = useQuery<TaxonResults>(GET_TAXON, {
        variables: {
            rank,
            canonicalName: name
        },
    });
    const taxon = taxonResults.data?.taxon

    const thresholds = [
        { name: "low", color: "#f47625", start: 0, end: 50 },
        { name: "decent", color: "#febb1e", start: 50, end: 75 },
        { name: "great", color: "#97bc5d", start: 75, end: 100 },
    ]

    const rankGenomes = taxon?.dataSummary.filter(i => i.genomes > 0).map(summary => {
        return { name: summary.name || '', value: summary.genomes }
    })

    const rankOther = taxon?.dataSummary.filter(i => i.totalGenomic > 0).map(summary => {
        return { name: summary.name || '', value: summary.totalGenomic }
    })

    const speciesGenomes = taxon?.speciesSummary.filter(i => i.genomes > 0).map(summary => {
        return { name: summary.name || '', value: summary.genomes }
    }).sort((a, b) => b.value - a.value)

    const speciesOther = taxon?.speciesSummary.filter(i => i.totalGenomic > 0).map(summary => {
        return { name: summary.name || '', value: summary.totalGenomic }
    }).sort((a, b) => b.value - a.value)

    const genomePercentile = taxon && speciesGenomes && (speciesGenomes?.length / taxon?.summary.species) * 100;

    return (
        <Paper radius="20px" mr={50} style={{ position: "absolute", top: 200, right: 0, width: "650px" }}>
          <LoadOverlay visible={taxonResults.loading} />
            <Grid p={20}>
              <Grid.Col span={6}>
                <Title order={5}>Data summary</Title>
                <Stack>
                  <Text fz="sm" fw={300}>Percentage of species with genomes</Text>
                  {taxon && <TachoChart h={250} thresholds={thresholds} value={Math.round(genomePercentile || 0)} />}
                </Stack>
              </Grid.Col>

              <Grid.Col span={6}>
                <Title order={5}>Taxonomic breakdown</Title>

                <DataTable my={2}>
                  <DataTableRow label={`Number of biota`}>
                    <DataField value={taxon?.summary.children}></DataField>
                  </DataTableRow>
                  <DataTableRow label="Number of species/OTUs">
                    <DataField value={Humanize.formatNumber(taxon?.summary.species || 0)} />
                  </DataTableRow>
                  <DataTableRow label={`Biota with genomes`}>
                    <DataField value={rankGenomes?.length} />
                  </DataTableRow>
                  <DataTableRow label="Species with genomes">
                    <DataField value={speciesGenomes?.length} />
                  </DataTableRow>
                  <DataTableRow label={`Biota with data`}>
                    <DataField value={rankOther?.length} />
                  </DataTableRow>
                  <DataTableRow label="Species with data">
                    <DataField value={speciesOther?.length} />
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

              <Grid.Col span={6}>
                <Stack>
                  <Text fz="sm" fw={300}>Species with genomes</Text>
                  {speciesGenomes && <BarChart h={250} data={speciesGenomes.slice(0, 10)} spacing={0.1} />}
                </Stack>
              </Grid.Col>
              <Grid.Col span={6} style={{alignSelf:"end"}}>
                <Text fz="sm" fw={300}>Note: these statistics summarise the content indexed within ARGA.  The values relate to the species deemed relevant to Australia (either by endemicity or economic and social value), and for repositories that are indexed by ARGA.  The values may not be indicative of global values for all research.</Text>
              </Grid.Col>

            </Grid>
        </Paper>

    )
}
