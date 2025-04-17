"use client";

import { Paper, Title, Box, Text, Stack, Grid } from "@mantine/core";
import { TachoChart } from "@/components/graphing/tacho";
import { BarChart } from "@/components/graphing/bar";
import { GenomeCompletion } from "@/app/genome-tracker/_components/genome-completion";
import { DataNoteActions } from "@/components/data-note-actions";

interface DataBreakdown {
  canonicalName: string;
  genomes: number;
  totalGenomic: number;
}

interface ClassificationNode {
  scientificName: string;
  canonicalName: string;
  rank: string;
  depth: number;
}

export interface Taxonomy {
  scientificName: string;
  scientificNameAuthorship: string;
  canonicalName: string;
  status: string;
  nomenclaturalCode: string;
  citation?: string;
  source?: string;
  sourceUrl?: string;
  hierarchy: ClassificationNode[];
  speciesGenomicDataSummary: DataBreakdown[];
  speciesGenomesSummary: DataBreakdown[];
  lowerRankSummary: {
    total: number;
    genomes: number;
    genomicData: number;
  };
  speciesRankSummary: {
    total: number;
    genomes: number;
    genomicData: number;
  };
  speciesSummary: {
    total: number;
    genomes: number;
    totalGenomic: number;
  };
  descendants: {
    canonicalName: string;
    species: number;
    speciesData: number;
    speciesGenomes: number;
  }[];
}

interface DataSummary {
  genomes: number;
  loci: number;
  specimens: number;
  other: number;
}

const CLASSIFICATIONS_CHILD_MAP: Record<string, string> = {
  DOMAIN: "kingdom",
  SUPERKINGDOM: "kingdom",
  KINGDOM: "phylum",
  SUBKINGDOM: "phylum",
  PHYLUM: "class",
  SUBPHYLUM: "class",
  SUPERCLASS: "class",
  CLASS: "order",
  SUBCLASS: "order",
  INFRACLASS: "order",
  SUPERORDER: "order",
  ORDER: "family",
  SUBORDER: "family",
  INFRAORDER: "family",
  SUPERFAMILY: "family",
  FAMILY: "genus",
  SUBFAMILY: "genus",
  SUPERTRIBE: "genus",
  TRIBE: "genus",
  SUBTRIBE: "genus",
  GENUS: "species",
  SUBGENUS: "species",
  SPECIES: "subspecies",
  SUBSPECIES: "subspecies",

  UNRANKED: "unranked",
  HIGHERTAXON: "higher taxon",

  AGGREGATEGENERA: "aggregate genera",
  AGGREGATESPECIES: "aggregate species",
  INCERTAESEDIS: "incertae sedis",

  REGNUM: "division",
  DIVISION: "classis",
  SUBDIVISION: "classis",
  CLASSIS: "ordo",
  SUBCLASSIS: "ordo",
  SUPERORDO: "ordo",
  ORDO: "familia",
  SUBORDO: "familia",
  COHORT: "familia",
  FAMILIA: "genus",
  SUBFAMILIA: "genus",
  SECTION: "species",
  SECTIO: "species",
  SERIES: "species",
  VARIETAS: "subvarietas",
  SUBVARIETAS: "subvarietas",
  FORMA: "forma",

  NOTHOVARIETAS: "nothovarietas",
  INFRASPECIES: "infraspecies",
  REGIO: "regio",
  SPECIALFORM: "special form",
};

const ALL_RANKS = ["DOMAIN", "KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"];

function pluralTaxon(rank: string) {
  if (rank === "division") return "divisions";
  else if (rank === "kingdom") return "kingdoms";
  else if (rank === "phylum") return "phyla";
  else if (rank === "class") return "classes";
  else if (rank === "order") return "orders";
  else if (rank === "family") return "families";
  else if (rank === "genus") return "genera";
  else return rank;
}

export function DataSummary({ rank, taxon }: { rank: string; taxon: Taxonomy | undefined }) {
  const childTaxon = CLASSIFICATIONS_CHILD_MAP[rank] || "";
  const childTaxonLabel = pluralTaxon(childTaxon);

  const minDate = new Date("2009-01-01");
  const maxDate = new Date(`${new Date().getFullYear() + 10}-01-01`);

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

  const speciesOther = taxon?.speciesGenomicDataSummary
    .filter((i) => i.totalGenomic > 0)
    .map((summary) => {
      const linkName = encodeURIComponent(summary.canonicalName.replaceAll(" ", "_"));
      return {
        name: summary.canonicalName || "",
        value: summary.totalGenomic,
        href: `/species/${linkName}`,
      };
    })
    .sort((a, b) => b.value - a.value);

  const genomePercentile = taxon && (taxon.speciesRankSummary.genomes / taxon.speciesRankSummary.total) * 100;
  const otherPercentile = taxon && (taxon.speciesRankSummary.genomicData / taxon.speciesRankSummary.total) * 100;

  function collapsable(span: number) {
    return { base: span, xs: 12, sm: 12, md: span, lg: span, xl: span };
  }

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={5}>Data summary</Title>
      </Grid.Col>
      <Grid.Col span="auto">
        <Paper h={560} p="lg" radius="lg" withBorder>
          <Stack h="100%" justify="space-between" style={{ overflow: "hidden" }}>
            <Box h={400}>
              <GenomeCompletion
                taxonRank={rank}
                taxonCanonicalName={taxon?.canonicalName || ""}
                domain={[minDate, maxDate]}
              />
            </Box>
            <Text fw={300} size="sm">
              This graph shows the aggregated total of species for which a whole genome has been sequenced and made
              available. The first instance of a whole genome sequence for an individual species has been plotted as an
              accumulated total. Statistics based on records indexed within ARGA.
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col span={4}>
        <Paper h={560} p="xl" radius="lg" withBorder>
          <Title order={5}>Other graph here</Title>
          <Text>content</Text>
        </Paper>
      </Grid.Col>
      <Grid.Col span={12}>
        <Grid mt="xl">
          <Grid.Col span={{ xs: 12, sm: 12, md: 8, lg: 9, xl: 10 }}>
            <Grid>
              <Grid.Col span={collapsable(4)}>
                <Stack>
                  <Text fz="sm" fw={300}>
                    Percentage of species with genomes
                  </Text>
                  {taxon && (
                    <TachoChart
                      mt={10}
                      h={150}
                      w={300}
                      thresholds={thresholds}
                      value={Math.round(genomePercentile || 0)}
                    />
                  )}
                </Stack>
              </Grid.Col>
              <Grid.Col span={collapsable(8)}>
                <Stack>
                  <Text fz="sm" fw={300}>
                    Species with genomes
                  </Text>
                  {speciesGenomes && <BarChart h={200} data={speciesGenomes.slice(0, 8)} spacing={0.1} />}
                </Stack>
              </Grid.Col>
              <Grid.Col span={collapsable(4)}>
                <Stack>
                  <Text fz="sm" fw={300}>
                    Percentage of species with any genetic data
                  </Text>
                  {taxon && (
                    <TachoChart
                      mt={10}
                      h={150}
                      w={300}
                      thresholds={thresholds}
                      value={Math.round(otherPercentile || 0)}
                    />
                  )}
                </Stack>
              </Grid.Col>
              <Grid.Col span={collapsable(8)}>
                <Stack>
                  <Text fz="sm" fw={300}>
                    Species with any genetic data
                  </Text>
                  {speciesOther && <BarChart h={200} data={speciesOther.slice(0, 8)} spacing={0.1} />}
                </Stack>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={{ xs: 12, sm: 12, md: 4, lg: 3, xl: 2 }}>
            <DataNoteActions />
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
}
