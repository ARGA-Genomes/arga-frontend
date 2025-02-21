"use client";

import classes from "./genome-composition.module.css";

import * as Humanize from "humanize-plus";
import { TaxonomicRankStatistic } from "@/queries/stats";
import { Polygon } from "@visx/shape";
import { Group } from "@visx/group";

const LEVEL_HEIGHT = 27;
const LEVEL_SLANT = 7;
const LEVEL_EXPANSION = 40;

type Level = {
  label: string;
  total: number;
  points: [number, number][];
  width: number;
  className: string;
};

function fromRankStat(stat: TaxonomicRankStatistic, level: number): Level {
  const width = LEVEL_EXPANSION * level;

  let className = classes.coverageLow;
  if (stat.coverage >= 0.25) {
    className = classes.coverageMiddle;
  }
  if (stat.coverage >= 0.75) {
    className = classes.coverageHigh;
  }

  return {
    className: className,
    label: Humanize.capitalize(stat.rank.toLowerCase()),
    total: stat.children,
    width: width,
    points: [
      [LEVEL_SLANT, 0],
      [width - LEVEL_SLANT, 0],
      [width, LEVEL_HEIGHT - 1],
      [0, LEVEL_HEIGHT - 1],
    ],
  };
}

interface GenomeCompositionProps {
  data: TaxonomicRankStatistic[];
}

export const GenomeComposition = ({ data }: GenomeCompositionProps) => {
  const levels: Level[] = data.map((stat, idx) => fromRankStat(stat, idx + 1));
  const maxWidth = levels[levels.length - 1].width;
  const center = maxWidth / 2;

  return (
    <svg viewBox={`0 0 ${maxWidth} ${levels.length * LEVEL_HEIGHT}`}>
      {levels.map((level, idx) => (
        <Group left={center} top={idx * LEVEL_HEIGHT} key={level.label} className={classes.level}>
          <Group left={-level.width / 2}>
            <Polygon points={level.points} className={level.className} />
          </Group>
        </Group>
      ))}
    </svg>
  );
};
