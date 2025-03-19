"use client";

import classes from "./grouping-completion.module.css";

import * as Humanize from "humanize-plus";

import { RadialBarDatum, RadialGraph } from "@/components/graphing/RadialBar";
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
} from "@mantine/core";
import { useState } from "react";
import { Text as SvgText } from "@visx/text";
import { motion } from "framer-motion";
import { Circle } from "@visx/shape";
import { CumulativeTracker } from "./cumulative-tracker";
import { TachoChart } from "@/components/graphing/tacho";
import { GenomeCompletion } from "./genome-completion";

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
    rankStats: ["CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  birds: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Aves",
    includeRanks: ["CLASS", "ORDER"],
    rankStats: ["CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  reptiles: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Reptilia",
    includeRanks: ["CLASS", "ORDER"],
    rankStats: ["CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  corals: {
    taxonRank: "ORDER",
    taxonCanonicalName: "Scleractinia",
    includeRanks: ["ORDER", "FAMILY"],
    rankStats: ["ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  amphibians: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Amphibia",
    includeRanks: ["CLASS", "ORDER"],
    rankStats: ["CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  insects: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Insecta",
    includeRanks: ["CLASS", "ORDER"],
    rankStats: ["CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  molluscs: {
    taxonRank: "PHYLUM",
    taxonCanonicalName: "Mollusca",
    includeRanks: ["PHYLUM", "CLASS"],
    rankStats: ["PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  fungi: {
    taxonRank: "KINGDOM",
    taxonCanonicalName: "Fungi",
    includeRanks: ["KINGDOM", "PHYLUM"],
    rankStats: ["KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
  "flowering plants": {
    taxonRank: "CLASS",
    taxonCanonicalName: "Equisetopsida",
    includeRanks: ["CLASS", "ORDER"],
    rankStats: ["CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
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
};

function asPercentage(data: RadialBarDatum[]) {
  return data.map((datum) => ({
    label: datum.label,
    value: (datum.value / datum.total) * 100 || 0,
    total: 100,
  }));
}

interface GroupSelectionProps {
  group: string;
  onSelected: (group: string) => void;
}

function GroupSelection({ group, onSelected }: GroupSelectionProps) {
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
    <Paper className={classes.groupButton} onClick={() => onSelected(group)} withBorder>
      <Group mt={10} ml={10}>
        <Image w={40} h={40} src={ICONS[group]} alt={group} />
        <Text>{Humanize.capitalize(group)}</Text>
      </Group>
      <Box h={200}>{coverage && <RadialGraph data={asPercentage(coverage)} />}</Box>
    </Paper>
  );
}

interface GroupDetailRadialProps {
  group: string;
}

function GroupDetailRadial({ group }: GroupDetailRadialProps) {
  const [showRaw, setShowRaw] = useState<boolean>(false);
  const [hoverItem, setHoverItem] = useState<RadialBarDatum | null>(null);

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

  let radialInner = "radialInner25";
  if (hoverItem && hoverItem?.value > 25) radialInner = "radialInner75";
  if (hoverItem && hoverItem?.value > 75) radialInner = "radialInner100";

  return (
    coverage && (
      <Stack gap="xl">
        <Box h={600}>
          <RadialGraph data={showRaw ? coverage : asPercentage(coverage)} onHover={setHoverItem}>
            {hoverItem && (
              <motion.g animate={{ scale: 2 }}>
                <Circle r={40} className={classes[radialInner]} />

                <SvgText className={classes.text}>{hoverItem.label}</SvgText>
                <SvgText y={10} className={classes.text}>
                  {showRaw ? `${hoverItem.value} / ${hoverItem.total}` : `${Math.round(hoverItem.value)}%`}
                </SvgText>
              </motion.g>
            )}
          </RadialGraph>
        </Box>
        <Center>
          <SegmentedControl
            size="md"
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
        <Text c="midnight.11" size="sm">
          Total of species for which a whole genome has been sequenced and made available aggregated by higher
          classification units.
        </Text>
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
    { name: "", color: getThemeColor("bushfire.5", theme), start: 0, end: 50 },
    { name: "", color: getThemeColor("wheat.5", theme), start: 50, end: 75 },
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
      <Paper radius="lg" p="lg" withBorder>
        <Stack gap="xl">
          <SpeciesCoverageTacho group={group} />
          <Text c="midnight.11" size="sm">
            Percentage of all species with genomes.
          </Text>
        </Stack>
      </Paper>

      <Paper radius="lg" p="lg" withBorder>
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

      <Paper radius="lg" p="lg" pb="xl" withBorder>
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

interface GroupDetailProps {
  group: string;
  domain: [Date, Date];
}

function GroupDetail({ group, domain }: GroupDetailProps) {
  return (
    <Paper radius="xl" p="lg" withBorder>
      <Stack>
        <Group justify="center" mt={10} ml={10}>
          <Image w={40} h={40} src={ICONS[group]} alt={group} />
          <Title order={3}>{Humanize.capitalize(group)}</Title>
        </Group>

        <Grid>
          <Grid.Col span={6}>
            <GroupDetailRadial group={group} />
          </Grid.Col>
          <Grid.Col span={6}>
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
            <GroupSelection onSelected={setGroup} group="mammals" />
            <GroupSelection onSelected={setGroup} group="birds" />
            <GroupSelection onSelected={setGroup} group="reptiles" />
            <GroupSelection onSelected={setGroup} group="amphibians" />
            <GroupSelection onSelected={setGroup} group="flowering plants" />
            <GroupSelection onSelected={setGroup} group="fungi" />
            <GroupSelection onSelected={setGroup} group="insects" />
            <GroupSelection onSelected={setGroup} group="corals" />
          </SimpleGrid>
        </Grid.Col>
        <Grid.Col span={8}>
          <GroupDetail group={group} domain={dateDomain} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
