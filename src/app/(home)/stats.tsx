"use client";

import { Attribute, DataField } from "@/components/highlight-stack";
import { DataTable, DataTableRow } from "@/components/data-table";
import { PieChart } from "@/components/graphing/pie";
import { TachoChart } from "@/components/graphing/tacho";
import { gql, useQuery } from "@apollo/client";
import { Grid, Paper, Stack, Title, Text } from "@mantine/core";
import * as Humanize from 'humanize-plus';
import { BarChart } from "@/components/graphing/bar";

const GET_TAXON = gql`
query TaxonSpecies($rank: TaxonRank, $canonicalName: String) {
  taxon(rank: $rank, canonicalName: $canonicalName) {
    scientificName
    canonicalName
    authority
    status
    kingdom
    phylum
    class
    order
    family
    genus
    vernacularGroup

    summary {
      children
      species
    }

    dataSummary {
      name
      genomes
      other
    }

    speciesSummary {
      name
      genomes
      other
    }
  }
}`;
type DataBreakdown = {
    name?: string,
    genomes: number,
    other: number,
}

type Taxonomy = {
    scientificName: string,
    canonicalName: string,
    authority?: string,
    status?: string,
    kingdom?: string,
    phylum?: string,
    class?: string,
    order?: string,
    family?: string,
    genus?: string,
    vernacularGroup?: string,
    dataSummary: DataBreakdown[]
    speciesSummary: DataBreakdown[]
    summary: {
        children: number,
        species: number,
    }
};

type TaxonResults = {
    taxon: Taxonomy,
}

function childTaxa(rank: string) {
    if (rank === 'KINGDOM') return 'phyla';
    else if (rank === 'PHYLUM') return 'classes';
    else if (rank === 'CLASS') return 'orders';
    else if (rank === 'ORDER') return 'families';
    else if (rank === 'FAMILY') return 'genera';
    return ''
}

export default function ShowStats({ rank, name }: { rank: string, name: String }) {
    const taxonResults = useQuery<TaxonResults>(GET_TAXON, {
        variables: {
            rank,
            canonicalName: name
        },
    });
    const taxon = taxonResults.data?.taxon
    /* const { classes } = useTableStyles(); */
    const childTaxon = childTaxa(rank);

    const thresholds = [
        { name: "low", color: "#f47625", start: 0, end: 50 },
        { name: "decent", color: "#febb1e", start: 50, end: 75 },
        { name: "great", color: "#97bc5d", start: 75, end: 100 },
    ]

    const rankGenomes = taxon?.dataSummary.filter(i => i.genomes > 0).map(summary => {
        return { name: summary.name || '', value: summary.genomes }
    })

    const rankOther = taxon?.dataSummary.filter(i => i.other > 0).map(summary => {
        return { name: summary.name || '', value: summary.other }
    })

    const speciesGenomes = taxon?.speciesSummary.filter(i => i.genomes > 0).map(summary => {
        return { name: summary.name || '', value: summary.genomes }
    }).sort((a, b) => b.value - a.value)

    const speciesOther = taxon?.speciesSummary.filter(i => i.other > 0).map(summary => {
        return { name: summary.name || '', value: summary.other }
    }).sort((a, b) => b.value - a.value)

    const genomePercentile = taxon && speciesGenomes && (speciesGenomes?.length / taxon?.summary.species) * 100;

    return (
        <Paper radius="20px" mr={50} style={{ position: "absolute", top: 200, right: 0, width: "650px" }}>
            <Grid p={20}>
                <Grid.Col span="auto">
                    <Title order={5}>Data summary</Title>
                    <Grid>
                        <Grid.Col span={5}>
                            <Stack>
                                <Text fz="sm" fw={300}>Percentage of species with genomes</Text>
                                {taxon && <TachoChart h={250} thresholds={thresholds} value={Math.round(genomePercentile || 0)} />}
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span="content">
                            <Paper p="xs" radius="lg" withBorder>
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
                            </Paper>
                        </Grid.Col>
                    </Grid>
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