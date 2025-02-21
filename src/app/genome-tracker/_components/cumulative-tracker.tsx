"use client";

import classes from "./cumulative-tracker.module.css";
import * as Humanize from "humanize-plus";
import { useMemo } from "react";

import { TaxonomicRankStatistic } from "@/queries/stats";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";

const PLURAL_RANKS: Record<string, string> = {
  DOMAIN: "Domains",
  KINGDOM: "Kingdoms",
  PHYLUM: "Phyla",
  CLASS: "Classes",
  ORDER: "Orders",
  FAMILY: "Families",
  GENUS: "Genera",
  SPECIES: "Species",
};

const BAR_HEIGHT = 45;
const BAR_MARGIN = 15;
const ROW_HEIGHT = BAR_HEIGHT + BAR_MARGIN;
const AXIS_HEIGHT = 30;
const GRAPH_PADDING = 20;
const LEFT_AXIS_WIDTH = 200;

interface CoverageBarProps {
  y: number;
  width: number;
  coverage: number;
}

function CoverageBar({ y, width, coverage }: CoverageBarProps) {
  return (
    <Group top={y}>
      <rect width={width} height={BAR_HEIGHT} className={classes.coverageBarBg} />
      <Bar width={coverage} height={BAR_HEIGHT} className={classes.coverageBar} />;
    </Group>
  );
}

interface BarsProps {
  width: number;
  height: number;
  data: TaxonomicRankStatistic[];
}

function Bars({ width, height, data }: BarsProps) {
  const barWidth = width - LEFT_AXIS_WIDTH;
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [0, barWidth],
        domain: [0, 100],
      }),
    [width],
  );

  return (
    <>
      {data.map((stat, idx) => (
        <text y={idx * ROW_HEIGHT + ROW_HEIGHT / 2} className={classes.barLabel}>
          {Humanize.formatNumber(stat.children)} {PLURAL_RANKS[stat.rank]}
        </text>
      ))}
      <Group left={LEFT_AXIS_WIDTH}>
        {data.map((stat, idx) => (
          <CoverageBar
            y={idx * ROW_HEIGHT}
            width={barWidth}
            coverage={xScale(Math.min(stat.coverage, 1.0) * 100)}
            key={stat.rank}
          />
        ))}
        <AxisBottom
          scale={xScale}
          numTicks={4}
          tickLength={height}
          hideAxisLine
          tickLineProps={{ className: classes.tickLine }}
          tickValues={[0, 25, 50, 75, 100]}
        />
      </Group>
    </>
  );
}

interface CumulativeTrackerProps {
  data: TaxonomicRankStatistic[];
}

export function CumulativeTracker({ data }: CumulativeTrackerProps) {
  const minHeight = data.length * ROW_HEIGHT;

  return (
    <ParentSize className={classes.graphContainer}>
      {(parent) => {
        const height = parent.height > minHeight ? parent.height : minHeight;
        const width = parent.width - GRAPH_PADDING * 2;

        return (
          <svg width={parent.width} height={height + AXIS_HEIGHT}>
            <Group width={width} left={GRAPH_PADDING / 2}>
              <Bars width={width} height={height} data={data} />
            </Group>
          </svg>
        );
      }}
    </ParentSize>
  );
}
