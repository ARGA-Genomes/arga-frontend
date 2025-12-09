"use client";

import classes from "./genome-composition.module.css";

import { Statistics, TaxonomicRankStatistic } from "@/generated/types";
import { gql, useQuery } from "@apollo/client";
import { Group } from "@visx/group";
import { Text } from "@visx/text";
import { max } from "d3";
import { motion, Transition } from "framer-motion";
import * as Humanize from "humanize-plus";
import { useState } from "react";

const LEVEL_HEIGHT = 27;
const LEVEL_SLANT = 10;
const LEVEL_EXPANSION = 40;
const LEVEL_RADIUS = 5;

const RANK_PLURALS: Record<string, string> = {
  Domain: "Domain",
  Kingdom: "Kingdoms",
  Phylum: "Phyla",
  Class: "Classes",
  Order: "Orders",
  Family: "Families",
  Genus: "Genera",
  Species: "Species",
};

const GET_TAXONOMIC_RANK_STATS = gql`
  query TaxonomicRankStats($taxonRank: TaxonomicRank, $taxonCanonicalName: String, $ranks: [TaxonomicRank]) {
    stats {
      taxonomicRanks(taxonRank: $taxonRank, taxonCanonicalName: $taxonCanonicalName, ranks: $ranks) {
        rank
        children
        coverage
        atLeastOne
      }
    }
  }
`;

type Level = {
  label: string;
  total: number;
  points: [number, number][];
  width: number;
  className: string;
  coverage: number;
};

function fromRankStat(stat: TaxonomicRankStatistic, level: number): Level {
  const width = LEVEL_EXPANSION * level;
  const atLeastOneCoverage = stat.atLeastOne / stat.children;

  let className = classes.coverageLow;
  if (atLeastOneCoverage >= 0.25) {
    className = classes.coverageMiddle;
  }
  if (atLeastOneCoverage >= 0.75) {
    className = classes.coverageHigh;
  }

  return {
    className: className,
    label: Humanize.capitalize(stat.rank.toLowerCase()),
    total: stat.children,
    coverage: atLeastOneCoverage,
    width: width,
    points: [
      [LEVEL_SLANT, 0],
      [width - LEVEL_SLANT, 0],
      [width, LEVEL_HEIGHT - 1],
      [0, LEVEL_HEIGHT - 1],
    ],
  };
}

interface SlantedBarProps {
  level: Level;
  maxWidth: number;
}

function SlantedBar({ level, maxWidth }: SlantedBarProps) {
  const [hovered, setHover] = useState(false);
  const r = LEVEL_RADIUS;

  const [x1, y1] = level.points[0];
  const [x2, y2] = level.points[1];
  const [x3, y3] = level.points[2];
  const [x4, y4] = level.points[3];

  const midX = (x2 + LEVEL_SLANT) / 2;
  const midY = y3 / 2;

  const corner1 = `L ${x2} ${y2} c ${r / 2} 0, ${r} ${r / 2}, ${r + 1} ${r}`;
  const corner2 = `L ${x3} ${y3 - r} c 0 ${r / 2}, ${-r / 2} ${r}, ${-r},${r}`;
  const corner3 = `L ${x4 + r} ${y4} c ${-r / 2} 0, ${-r} ${-r / 2}, ${-r} ${-r}`;
  const corner4 = `L ${x1 - r} ${y1 + r} c 1 ${-r / 2}, ${r / 2} ${-r}, ${r} ${-r}`;

  const variants = {
    hover: {
      width: maxWidth,
      x: x2 / 2 - (maxWidth / 2 - r),
    },
    initial: {
      width: 0,
      x: midX,
    },
  };

  const transition = {
    duration: 0.2,
    ease: [0, 0.71, 0.2, 1.01],
  } as unknown as Transition;

  return (
    <g onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      <motion.g animate={hovered ? { opacity: 0.9 } : { opacity: 0.5 }}>
        <path d={`M ${x1} ${y1} ${corner1} ${corner2} ${corner3} ${corner4}`} className={level.className} />;
        <motion.rect
          height={y3}
          rx={r}
          ry={r}
          variants={variants}
          animate={hovered ? "hover" : "initial"}
          transition={transition}
          className={level.className}
        />
      </motion.g>

      <motion.g
        animate={hovered ? { opacity: 1.0 } : { opacity: 0.0 }}
        transition={transition}
        className={level.className}
      >
        <Text className={classes.levelText} dy={midY - 2} dx={midX}>{`${Humanize.formatNumber(level.total)} ${
          RANK_PLURALS[level.label]
        }`}</Text>
        <text className={classes.levelDescriptionText} dy={midY + 4} dx={midX}>
          <tspan>At least 1 genome from each {level.label.toLocaleLowerCase()}: </tspan>
          <tspan fontWeight={600}>{Math.round(level.coverage * 100)}% complete</tspan>
        </text>
      </motion.g>
    </g>
  );
}

interface GenomeCompositionProps {
  ranks: string[];
}

export const GenomeComposition = ({ ranks }: GenomeCompositionProps) => {
  const { data } = useQuery<{ stats: Statistics }>(GET_TAXONOMIC_RANK_STATS, {
    variables: {
      taxonRank: "DOMAIN",
      taxonCanonicalName: "Eukaryota",
      ranks,
    },
  });

  const stats = data?.stats.taxonomicRanks;

  const levels: Level[] = stats?.map((stat, idx) => fromRankStat(stat, idx + 1)) ?? [];
  const maxWidth = max(levels, (levels: Level) => levels.width) ?? 0;
  const center = maxWidth / 2;

  return (
    <svg viewBox={`0 0 ${maxWidth} ${levels.length * LEVEL_HEIGHT}`}>
      {levels.map((level, idx) => (
        <Group left={center} top={idx * LEVEL_HEIGHT} key={level.label}>
          <Group left={-level.width / 2}>
            <SlantedBar level={level} maxWidth={maxWidth} />
          </Group>
        </Group>
      ))}
    </svg>
  );
};
