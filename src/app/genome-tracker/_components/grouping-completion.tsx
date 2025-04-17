"use client";

import classes from "./grouping-completion.module.css";

import * as Humanize from "humanize-plus";

import { asPercentage, RadialBarDatum, RadialGraph } from "@/components/graphing/RadialBar";
import { gql, useQuery } from "@apollo/client";
import {
  Text,
  Image,
  Box,
  Center,
  Grid,
  Group,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Title,
  useMantineTheme,
  getThemeColor,
  MantineSize,
} from "@mantine/core";
import { useState } from "react";
import { Text as SvgText } from "@visx/text";
import { motion } from "framer-motion";
import { Circle } from "@visx/shape";
import { CumulativeTracker } from "./cumulative-tracker";
import { TachoChart } from "@/components/graphing/tacho";
import { GenomeCompletion } from "./genome-completion";
import { BarChart } from "@/components/graphing/bar";
import { useDatasets } from "@/app/source-provider";

const GET_SPECIES_GENOME_SUMMARY = gql`
  query SpeciesGenomeSummary($rank: TaxonRank, $canonicalName: String, $datasetId: UUID) {
    taxon(by: { classification: { rank: $rank, canonicalName: $canonicalName, datasetId: $datasetId } }) {
      speciesGenomesSummary {
        canonicalName
        genomes
        totalGenomic
      }
    }
  }
`;

export interface SpeciesGenomeSummary {
  taxon: {
    speciesGenomesSummary: {
      canonicalName: string;
      genomes: number;
      totalGenomic: number;
    }[];
  };
}

const GET_COVERAGE_STATS = gql`
  query TaxonCoverageStats($taxonRank: TaxonomicRank, $taxonCanonicalName: String, $includeRanks: [TaxonomicRank]) {
    stats {
      taxonBreakdown(taxonRank: $taxonRank, taxonCanonicalName: $taxonCanonicalName, includeRanks: $includeRanks) {
        scientificName
        canonicalName
        species
        fullGenomes
        fullGenomesCoverage

        children {
          scientificName
          canonicalName
          species
          fullGenomes
          fullGenomesCoverage
        }
      }
    }
  }
`;

type CoverageStatsQuery = {
  stats: {
    taxonBreakdown: RootTaxonCoverage[];
  };
};

type TaxonCoverage = {
  scientificName: string;
  canonicalName: string;
  species: number;
  fullGenomes: number;
  fullGenomesCoverage: number;
};

type RootTaxonCoverage = TaxonCoverage & {
  children: TaxonCoverage[];
};

interface QueryParams {
  taxonRank: string;
  taxonCanonicalName: string;
  includeRanks: string[];
  rankStats: string[];
}

const QUERIES: Record<string, QueryParams> = {
  mammals: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Mammalia",
    includeRanks: ["CLASS", "ORDER"],
    rankStats: ["ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  birds: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Aves",
    includeRanks: ["CLASS", "ORDER"],
    rankStats: ["ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  reptiles: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Reptilia",
    includeRanks: ["CLASS", "ORDER"],
    rankStats: ["ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  corals: {
    taxonRank: "ORDER",
    taxonCanonicalName: "Scleractinia",
    includeRanks: ["ORDER", "FAMILY"],
    rankStats: ["FAMILY", "GENUS", "SPECIES"],
  },
  amphibians: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Amphibia",
    includeRanks: ["CLASS", "ORDER"],
    rankStats: ["ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  insects: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Insecta",
    includeRanks: ["CLASS", "ORDER"],
    rankStats: ["ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  molluscs: {
    taxonRank: "PHYLUM",
    taxonCanonicalName: "Mollusca",
    includeRanks: ["PHYLUM", "CLASS"],
    rankStats: ["CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  snails: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Gastropoda",
    includeRanks: ["CLASS", "ORDER"],
    rankStats: ["ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  fungi: {
    taxonRank: "KINGDOM",
    taxonCanonicalName: "Fungi",
    includeRanks: ["KINGDOM", "PHYLUM"],
    rankStats: ["PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  "flowering plants": {
    taxonRank: "CLASS",
    taxonCanonicalName: "Equisetopsida",
    includeRanks: ["CLASS", "ORDER"],
    rankStats: ["ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  "fin fishes": {
    taxonRank: "CLASS",
    taxonCanonicalName: "Actinopterygii",
    includeRanks: ["CLASS", "ORDER"],
    rankStats: ["ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
};

const ICONS: Record<string, string> = {
  mammals: "/icons/taxon/Taxon_ Mammals (Mammalia).svg",
  birds: "/icons/taxon/Taxon_ Birds (Aves).svg",
  reptiles: "/icons/taxon/Taxon_ Reptiles (Reptilia).svg",
  amphibians: "/icons/taxon/Taxon_ Frogs and toads (Anura).svg",
  "flowering plants": "/icons/taxon/Taxon_ Flowering plants (Magnoliidae).svg",
  fungi: "/icons/taxon/Taxon_ Fungi (Fungi).svg",
  insects: "/icons/taxon/Taxon_ Insects (Insecta).svg",
  corals: "/icons/taxon/Taxon_ Hard corals (Order Scleractinia).svg",
  "fin fishes": "/icons/taxon/Taxon_ Finfishes (Actinopterygii).svg",
};

interface GroupSelectionProps {
  group: string;
  onSelected: (group: string) => void;
  selected?: boolean;
}

function GroupSelection({ group, onSelected, selected }: GroupSelectionProps) {
  const query = QUERIES[group];

  const { data } = useQuery<CoverageStatsQuery>(GET_COVERAGE_STATS, {
    variables: {
      taxonRank: query.taxonRank,
      taxonCanonicalName: query.taxonCanonicalName,
      includeRanks: query.includeRanks,
    },
  });

  // taxon breakdown only returns stats for the default taxonomy right now, so we just grab
  // the first root found in the array
  const coverage = data?.stats.taxonBreakdown[0]?.children.map((taxon) => ({
    label: taxon.canonicalName,
    value: taxon.fullGenomesCoverage ?? 0,
    total: taxon.species,
  }));

  return (
    <Paper
      className={selected ? classes.groupButtonSelected : classes.groupButton}
      onClick={() => onSelected(group)}
      pt="xs"
      withBorder
    >
      <Center>
        <Text className={classes.groupButtonLabel}>{Humanize.capitalize(group)}</Text>
      </Center>
      <Box h={200}>{coverage && <RadialGraph data={asPercentage(coverage)} />}</Box>
    </Paper>
  );
}

interface GroupDetailRadialProps {
  query: QueryParams;
  height?: number;
  radial?: number;
  fontSize?: number;
  hideDescription?: boolean;
  switcherGap?: MantineSize;
  switcherSize?: MantineSize;
}

export function GroupDetailRadial({
  fontSize,
  switcherSize,
  switcherGap,
  hideDescription,
  height,
  radial,
  query,
}: GroupDetailRadialProps) {
  const [showRaw, setShowRaw] = useState<boolean>(false);
  const [hoverItem, setHoverItem] = useState<RadialBarDatum | null>(null);

  const { data } = useQuery<CoverageStatsQuery>(GET_COVERAGE_STATS, {
    variables: {
      taxonRank: query.taxonRank,
      taxonCanonicalName: query.taxonCanonicalName,
      includeRanks: query.includeRanks,
    },
  });

  // taxon breakdown only returns stats for the default taxonomy right now, so we just grab
  // the first root found in the array
  const coverage = data?.stats.taxonBreakdown[0]?.children.map((taxon) => ({
    label: taxon.canonicalName,
    value: taxon.fullGenomesCoverage ?? 0,
    total: taxon.species,
  }));

  let radialInner = "radialInner25";
  if (hoverItem && hoverItem?.value > 25) radialInner = "radialInner75";
  if (hoverItem && hoverItem?.value > 75) radialInner = "radialInner100";

  return (
    coverage && (
      <Stack gap={switcherGap || "xl"}>
        <Box h={height || 600}>
          <RadialGraph data={showRaw ? coverage : asPercentage(coverage)} onHover={setHoverItem}>
            {hoverItem && (
              <motion.g animate={{ scale: 2 }}>
                <Circle r={radial || 40} className={classes[radialInner]} />

                <SvgText fontSize={fontSize || 8} className={classes.text}>
                  {hoverItem.label}
                </SvgText>
                <SvgText fontSize={fontSize || 8} y={10} className={classes.text}>
                  {showRaw ? `${hoverItem.value} / ${hoverItem.total}` : `${Math.round(hoverItem.value)}%`}
                </SvgText>
              </motion.g>
            )}
          </RadialGraph>
        </Box>
        <Center>
          <SegmentedControl
            size={switcherSize || "md"}
            radius="xl"
            color="moss.5"
            data={[
              { label: "Percentile", value: "percentage" },
              { label: "Raw numbers", value: "raw" },
            ]}
            defaultValue="percentage"
            onChange={(value) => setShowRaw(value == "raw")}
          />
        </Center>
        {!hideDescription && (
          <Text c="midnight.11" size="sm">
            Total of species for which a whole genome has been sequenced and made available aggregated by higher
            classification units.
          </Text>
        )}
      </Stack>
    )
  );
}

interface SpeciesCoverageTacho {
  group: string;
}

function SpeciesCoverageTacho({ group }: SpeciesCoverageTacho) {
  const theme = useMantineTheme();
  const query = QUERIES[group];

  const { data } = useQuery<CoverageStatsQuery>(GET_COVERAGE_STATS, {
    variables: {
      taxonRank: query.taxonRank,
      taxonCanonicalName: query.taxonCanonicalName,
      includeRanks: [query.taxonRank],
    },
  });

  const stat = data?.stats.taxonBreakdown[0];
  const value = ((stat?.fullGenomesCoverage || 0) / (stat?.species || 0)) * 100;

  const thresholds = [
    { name: "", color: getThemeColor("bushfire.5", theme), start: 0, end: 25 },
    { name: "", color: getThemeColor("wheat.5", theme), start: 25, end: 75 },
    { name: "", color: getThemeColor("moss.5", theme), start: 75, end: 100 },
  ];

  return <TachoChart thresholds={thresholds} value={Math.round(value || 0)} h={150} />;
}

interface GroupDetailExtraProps {
  group: string;
  domain: [Date, Date];
}

function GroupDetailExtra({ group, domain }: GroupDetailExtraProps) {
  const query = QUERIES[group];

  return (
    <Stack>
      <Paper radius="lg" p="lg">
        <Stack gap="xl">
          <SpeciesCoverageTacho group={group} />
          <Text c="midnight.11" size="sm">
            Percentage of all species with genomes.
          </Text>
        </Stack>
      </Paper>

      <Paper radius="lg" p="lg">
        <Stack gap="xl">
          <Box h={300}>
            <GenomeCompletion
              taxonRank={query.taxonRank}
              taxonCanonicalName={query.taxonCanonicalName}
              domain={domain}
            />
          </Box>
          <Text c="midnight.11" size="sm">
            Rate of genome completion over time. The first instance of a whole genome sequence for an individual species
            has been plotted as an accumulated total, shown on a logarithmic scale.
          </Text>
        </Stack>
      </Paper>

      <Paper radius="lg" p="lg" pb="xl">
        <Stack gap="xl">
          <Box h={300}>
            <CumulativeTracker
              taxonRank={query.taxonRank}
              taxonCanonicalName={query.taxonCanonicalName}
              ranks={query.rankStats}
            />
          </Box>
          <Text c="midnight.11" size="sm">
            Percentage of taxonomic group coverage, where there is a complete genome for at least one representative
            species from each grouping.
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
}

function SpeciesWithGenomes({ group }: { group: string }) {
  const query = QUERIES[group];

  const { names } = useDatasets();
  const datasetId = names.get("Atlas of Living Australia")?.id;

  const { data } = useQuery<SpeciesGenomeSummary>(GET_SPECIES_GENOME_SUMMARY, {
    variables: {
      datasetId,
      rank: query.taxonRank,
      canonicalName: query.taxonCanonicalName,
    },
  });

  const speciesGenomes = data?.taxon.speciesGenomesSummary
    .filter((summary) => summary.genomes > 0)
    .map((summary) => {
      const linkName = encodeURIComponent(summary.canonicalName.replaceAll(" ", "_"));
      return {
        name: summary.canonicalName || "",
        value: summary.genomes,
        href: `/species/${linkName}`,
      };
    })
    .sort((a, b) => b.value - a.value);

  return speciesGenomes && <BarChart h={200} data={speciesGenomes.slice(0, 8)} spacing={0.1} />;
}

interface GroupDetailProps {
  group: string;
  domain: [Date, Date];
}

function GroupDetail({ group, domain }: GroupDetailProps) {
  const query = QUERIES[group];

  return (
    <Paper radius="xl" p="lg" withBorder>
      <Stack>
        <Grid>
          <Grid.Col span={6}>
            <Stack gap={60}>
              <GroupDetailRadial query={query} />

              <Stack>
                <Text fw={300} fz="xs">
                  Species with genomes
                </Text>
                <SpeciesWithGenomes group={group} />
              </Stack>
            </Stack>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group justify="center" my="lg">
              <Image w={100} h={100} src={ICONS[group]} alt={group} />
              <Stack gap={0}>
                <Title order={2}>{Humanize.capitalize(group)}</Title>
                <Text fz="xl">
                  {Humanize.capitalize(query.taxonRank.toLocaleLowerCase())} {query.taxonCanonicalName}
                </Text>
              </Stack>
            </Group>

            <GroupDetailExtra group={group} domain={domain} />
          </Grid.Col>
        </Grid>
      </Stack>
    </Paper>
  );
}

interface GroupingCompletionProps {
  dateDomain: [Date, Date];
}

export function GroupingCompletion({ dateDomain }: GroupingCompletionProps) {
  const [group, setGroup] = useState<string>("mammals");

  return (
    <Stack>
      <Grid>
        <Grid.Col span={4}>
          <SimpleGrid cols={2}>
            <GroupSelection onSelected={setGroup} group="mammals" selected={group == "mammals"} />
            <GroupSelection onSelected={setGroup} group="birds" selected={group == "birds"} />
            <GroupSelection onSelected={setGroup} group="reptiles" selected={group == "reptiles"} />
            <GroupSelection onSelected={setGroup} group="amphibians" selected={group == "amphibians"} />
            <GroupSelection onSelected={setGroup} group="flowering plants" selected={group == "flowering plants"} />
            <GroupSelection onSelected={setGroup} group="fungi" selected={group == "fungi"} />
            <GroupSelection onSelected={setGroup} group="insects" selected={group == "insects"} />
            <GroupSelection onSelected={setGroup} group="corals" selected={group == "corals"} />
            <GroupSelection onSelected={setGroup} group="fin fishes" selected={group == "fin fishes"} />
            <GroupSelection onSelected={setGroup} group="snails" selected={group == "snails"} />
          </SimpleGrid>
        </Grid.Col>
        <Grid.Col span={8}>
          <GroupDetail group={group} domain={dateDomain} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
