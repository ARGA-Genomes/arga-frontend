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
} from "@mantine/core";
import { useState } from "react";
import { Text as SvgText } from "@visx/text";
import { motion } from "framer-motion";
import { Circle } from "@visx/shape";
import { GenomeCompletion } from "./genome-completion";
import { CumulativeTracker } from "./cumulative-tracker";

const GET_COVERAGE_STATS = gql`
  query TaxonCoverageStats($taxonRank: TaxonomicRank, $taxonCanonicalName: String, $includeRanks: [TaxonomicRank]) {
    stats {
      taxonBreakdown(taxonRank: $taxonRank, taxonCanonicalName: $taxonCanonicalName, includeRanks: $includeRanks) {
        scientificName
        canonicalName
        species
        completeGenomes
        completeGenomesCoverage

        children {
          scientificName
          canonicalName
          species
          completeGenomes
          completeGenomesCoverage
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
  completeGenomes: number;
  completeGenomesCoverage: number;
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
    taxonRank: "SUBCLASS",
    taxonCanonicalName: "Hexacorallia",
    includeRanks: ["SUBCLASS", "ORDER"],
    rankStats: ["SUBCLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
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
  "flowering-plants": {
    taxonRank: "PHYLUM",
    taxonCanonicalName: "Charophyta",
    includeRanks: ["PHYLUM", "CLASS"],
    rankStats: ["PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
  },
};

const ICONS: Record<string, string> = {
  mammals: "/species-icons/mammals.svg",
  birds: "/species-icons/birds.svg",
  reptiles: "/species-icons/reptiles.svg",
  amphibians: "/species-icons/frogs.svg",
  "flowering-plants": "/species-icons/flowering_plants.svg",
  fungi: "/species-icons/fungi.svg",
  insects: "/species-icons/insecta.svg",
  corals: "/species-icons/corals.svg",
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
    value: taxon.completeGenomesCoverage ?? 0,
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

interface GroupDetailProps {
  group: string;
}

function GroupDetailRadial({ group }: GroupDetailProps) {
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
    value: taxon.completeGenomesCoverage ?? 0,
    total: taxon.species,
  }));

  let radialInner = "radialInner25";
  if (hoverItem && hoverItem?.value > 25) radialInner = "radialInner75";
  if (hoverItem && hoverItem?.value > 75) radialInner = "radialInner100";

  return (
    coverage && (
      <>
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
      </>
    )
  );
}

interface GroupDetailExtraProps {
  group: string;
}

function GroupDetailExtra({ group }: GroupDetailExtraProps) {
  const query = QUERIES[group];

  return (
    <Stack>
      <Box h={300}>
        <GenomeCompletion taxonRank={query.taxonRank} taxonCanonicalName={query.taxonCanonicalName} />
      </Box>

      <Box h={300}>
        <CumulativeTracker
          taxonRank={query.taxonRank}
          taxonCanonicalName={query.taxonCanonicalName}
          ranks={query.rankStats}
        />
      </Box>
    </Stack>
  );
}

interface GroupDetailProps {
  group: string;
}

function GroupDetail({ group }: GroupDetailProps) {
  return (
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
          <GroupDetailExtra group={group} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export function GroupingCompletion() {
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
            <GroupSelection onSelected={setGroup} group="flowering-plants" />
            <GroupSelection onSelected={setGroup} group="fungi" />
            <GroupSelection onSelected={setGroup} group="insects" />
            <GroupSelection onSelected={setGroup} group="corals" />
          </SimpleGrid>
        </Grid.Col>
        <Grid.Col span={8}>
          <GroupDetail group={group} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
