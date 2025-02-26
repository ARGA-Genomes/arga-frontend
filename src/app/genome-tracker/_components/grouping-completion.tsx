"use client";

import classes from "./grouping-completion.module.css";

import { RadialGraph } from "@/components/graphing/RadialBar";
import { gql, useQuery } from "@apollo/client";
import { Box, Center, Paper, Text } from "@mantine/core";

const GET_COVERAGE_STATS = gql`
  query TaxonCoverageStats($taxonRank: TaxonomicRank, $taxonCanonicalName: String, $includeRanks: [TaxonomicRank]) {
    stats {
      taxonBreakdown(taxonRank: $taxonRank, taxonCanonicalName: $taxonCanonicalName, includeRanks: $includeRanks) {
        scientificName
        canonicalName
        completeGenomes
        completeGenomesCoverage

        children {
          scientificName
          canonicalName
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
  completeGenomes: number;
  completeGenomesCoverage: number;
};

type RootTaxonCoverage = TaxonCoverage & {
  children: TaxonCoverage[];
};

const QUERIES: Record<string, object> = {
  mammals: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Mammalia",
    includeRanks: ["CLASS", "ORDER"],
  },
  birds: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Aves",
    includeRanks: ["CLASS", "ORDER"],
  },
  reptiles: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Reptilia",
    includeRanks: ["CLASS", "ORDER"],
  },
  "top-110-threatened": {
    taxonRank: "KINGDOM",
    taxonCanonicalName: "Animalia",
    includeRanks: ["KINGDOM", "PHYLUM"],
  },
  corals: {
    taxonRank: "SUBCLASS",
    taxonCanonicalName: "Hexacorallia",
    includeRanks: ["SUBCLASS", "ORDER"],
  },
};

interface GroupingCompletionProps {
  group: string;
  showGrid?: boolean;
  interactive?: boolean;
  h: number;
}

export function GroupingCompletion({ group, showGrid, interactive, h }: GroupingCompletionProps) {
  const { data } = useQuery<CoverageStatsQuery>(GET_COVERAGE_STATS, {
    variables: QUERIES[group],
  });

  // taxon breakdown only returns stats for the default taxonomy right now, so we just grab
  // the first root found in the array
  const coverage = data?.stats.taxonBreakdown[0]?.children.map((taxon) => ({
    label: taxon.canonicalName,
    value: taxon.completeGenomes,
  }));

  return <Box h={h}>{coverage && <RadialGraph data={coverage} showGrid={showGrid} interactive={interactive} />}</Box>;
}

interface GroupingCompletionButtonProps {
  group: string;
  h: number;
}

export function GroupingCompletionButton({ group, h }: GroupingCompletionButtonProps) {
  return (
    <Paper className={classes.groupButton} withBorder>
      <Center>
        <Text className={classes.groupButtonLabel}>{group}</Text>
      </Center>
      <GroupingCompletion h={h} group={group} showGrid={false} />
    </Paper>
  );
}
