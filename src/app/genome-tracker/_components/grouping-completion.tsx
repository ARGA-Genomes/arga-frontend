"use client";

import classes from "./grouping-completion.module.css";

import { RadialBarDatum, RadialGraph } from "@/components/graphing/RadialBar";
import { gql, useQuery } from "@apollo/client";
import { Box, Center, SegmentedControl, Stack } from "@mantine/core";
import { useState } from "react";
import { Text as SvgText } from "@visx/text";
import { motion } from "framer-motion";
import { Circle } from "@visx/shape";

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
          assemblyScaffolds
          assemblyScaffoldsCoverage
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
  assemblyScaffolds?: number;
  assemblyScaffoldsCoverage?: number;
};

type RootTaxonCoverage = TaxonCoverage & {
  children: TaxonCoverage[];
};

const QUERIES: Record<string, object> = {
  mammals: {
    taxonRank: "FAMILY",
    taxonCanonicalName: "Macropodidae",
    includeRanks: ["FAMILY", "GENUS"],
    /* taxonRank: "CLASS",
        xonCanonicalName: "Mammalia",
        cludeRanks: ["CLASS", "ORDER"], */
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
  amphibians: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Amphibia",
    includeRanks: ["CLASS", "ORDER"],
  },
  insects: {
    taxonRank: "CLASS",
    taxonCanonicalName: "Insecta",
    includeRanks: ["CLASS", "ORDER"],
  },
  molluscs: {
    taxonRank: "PHYLUM",
    taxonCanonicalName: "Mollusca",
    includeRanks: ["PHYLUM", "CLASS"],
  },
  fungi: {
    taxonRank: "KINGDOM",
    taxonCanonicalName: "Fungi",
    includeRanks: ["KINGDOM", "PHYLUM"],
  },
  "flowering-plants": {
    taxonRank: "PHYLUM",
    taxonCanonicalName: "Charophyta",
    includeRanks: ["PHYLUM", "CLASS"],
  },
};

function asPercentage(data: RadialBarDatum[]) {
  return data.map((datum) => ({
    label: datum.label,
    value: (datum.value / datum.total) * 100 || 0,
    total: 100,
  }));
}

export function GroupingCompletion() {
  const [group, setGroup] = useState<string>("mammals");
  const [showRaw, setShowRaw] = useState<boolean>(false);
  const [hoverItem, setHoverItem] = useState<RadialBarDatum | null>(null);

  const { data } = useQuery<CoverageStatsQuery>(GET_COVERAGE_STATS, {
    variables: QUERIES[group],
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
    <Stack>
      <SegmentedControl
        fullWidth
        size="xl"
        radius="md"
        data={[
          { label: "Mammals", value: "mammals" },
          { label: "Birds", value: "birds" },
          { label: "Reptiles", value: "reptiles" },
          { label: "Corals", value: "corals" },
        ]}
        defaultValue="mammals"
        onChange={setGroup}
      />

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
        {coverage && (
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
        )}
      </Box>
    </Stack>
  );
}
