"use client";

import classes from "./LineBarGraph.module.css";

import { Group } from "@visx/group";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AxisBottom, AxisLeft, AxisRight } from "@visx/axis";
import { LinePath, Bar } from "@visx/shape";
import { curveNatural } from "@visx/curve";
import { Grid } from "@visx/grid";
import { bisector, max, ScaleTime } from "d3";
import { motion } from "framer-motion";
import { localPoint } from "@visx/event";
import NumberFlow from "@number-flow/react";
import { useState } from "react";
import { IconArrowUp } from "@tabler/icons-react";
import { Center, Stack } from "@mantine/core";

const MotionNumberFlow = motion.create(NumberFlow);
const MotionArrowUp = motion.create(IconArrowUp);

// utils
const bisectDate = bisector<LineDatum, Date>((d) => d.x).center;

export interface LineDatum {
  x: Date;
  y: number;
}

export interface BarDatum {
  x1: Date;
  x2: Date;
  y: number;
}

/// The two data points within a highlighted range. Useful for showing
/// more data on interaction like in tooltips
export interface DataRange {
  line: {
    low: LineDatum;
    high: LineDatum;
    previousChange: number;
  };
  bar: {
    low: BarDatum;
    high: BarDatum;
  };
}

interface LineBarGraphProps {
  lineData: LineDatum[];
  barData: BarDatum[];
  dateDomain: [Date, Date];
  width: number;
  height: number;
}

export function LineBarGraph({ lineData, barData, dateDomain, width, height }: LineBarGraphProps) {
  const lineMax = max(lineData, (d) => d.y) ?? 0;
  const barMax = max(barData, (d) => d.y) ?? 0;

  // bounds inside the axes
  const graphWidth = width - 100;
  const graphHeight = height - 40;

  const xScale = scaleTime({
    range: [0, graphWidth],
    domain: dateDomain,
  });

  const yScale = scaleLinear<number>({
    range: [graphHeight, 0],
    domain: [0, lineMax],
  });

  const y2Scale = scaleLinear<number>({
    range: [graphHeight, 0],
    domain: [0, barMax],
  });

  const [highlightRange, setHighlightRange] = useState<DataRange | null>(null);

  const handlePointerMove = (event: React.MouseEvent<SVGElement>) => {
    const coords = localPoint(event);

    const date = xScale.invert(coords?.x || 0);
    const idx = bisectDate(lineData, date, 1);

    const range = {
      line: {
        low: lineData[idx - 1],
        high: lineData[idx] || lineData[lineData.length - 1],
        previousChange: (lineData[idx - 1]?.y - lineData[idx - 2]?.y) / lineData[idx - 2]?.y,
      },
      bar: {
        low: barData[idx - 1],
        high: barData[idx] || barData[barData.length - 1],
      },
    };

    setHighlightRange(range);
  };

  return (
    <>
      <svg width={width} height={height} onMouseMove={handlePointerMove}>
        <rect width={width} height={height} fill="transparent" />

        <Group left={50} top={10}>
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={graphWidth}
            height={graphHeight}
            numTicksRows={6}
            numTicksColumns={6}
          />

          <AxisBottom scale={xScale} top={graphHeight} numTicks={6} tickLabelProps={{ className: classes.scaleText }} />
          <AxisLeft scale={yScale} numTicks={6} tickLabelProps={{ className: classes.scaleText }} />
          <AxisRight scale={y2Scale} left={graphWidth} numTicks={6} tickLabelProps={{ className: classes.scaleText }} />

          <BarGraph data={barData} x={xScale} y={y2Scale} height={graphHeight} />
          <LineGraph data={lineData} x={xScale} y={yScale} />

          {highlightRange && (
            <motion.g animate={{ x: xScale(highlightRange.line.low.x) }}>
              <RangeHighlight scale={xScale} range={highlightRange} height={height - 11} />
            </motion.g>
          )}
        </Group>
      </svg>
    </>
  );
}

interface LineGraphProps {
  data: LineDatum[];
  x: ScaleTime<number, number>;
  y: (y: number) => number;
}

function LineGraph({ data, x, y }: LineGraphProps) {
  return (
    <Group>
      <LinePath data={data} x={(d) => x(d.x) ?? 0} y={(d) => y(d.y)} className={classes.line} curve={curveNatural} />
      {data.map((d) => (
        <motion.circle
          whileHover={{ scale: 2.0 }}
          key={d.x.getTime()}
          r={5}
          cx={x(d.x)}
          cy={y(d.y)}
          className={classes.lineDot}
        />
      ))}
    </Group>
  );
}

interface BarGraphProps {
  data: BarDatum[];
  x: ScaleTime<number, number>;
  y: (y: number) => number;
  height: number;
}

function BarGraph({ data, x, y, height }: BarGraphProps) {
  const gap = 10.0;

  return (
    <>
      {data.map((d) => {
        const x1 = x(d.x1) ?? 0;
        const x2 = x(d.x2) ?? 0;
        const width = x2 - x1 - gap;

        return (
          <Bar
            x={x1 - width / 2}
            y={y(d.y)}
            width={width}
            height={height - y(d.y)}
            className={classes.bar}
            key={d.x1.getTime()}
          />
        );
      })}
    </>
  );
}

interface RangeHighlightProps {
  scale: ScaleTime<number, number>;
  range: DataRange;
  height: number;
}

function RangeHighlight({ scale, range, height }: RangeHighlightProps) {
  const x1 = scale(range.line.low.x);
  const x2 = scale(range.line.high.x);
  const width = x2 - x1;

  const change = range.line.high.y - range.line.low.y;
  const percentage = change / range.line.low.y;
  const increased = range.line.previousChange < percentage;

  /* <path d={`M ${width / 2} 0 V ${height}`} className={classes.rangeHighlight} /> */

  const variants = {
    increased: {
      fill: "var(--mantine-color-moss-2)",
      stroke: "var(--mantine-color-moss-9)",
    },
    decreased: {
      fill: "var(--mantine-color-wheat-2)",
      stroke: "var(--mantine-color-wheat-9)",
    },
  };

  const color = increased ? "var(--mantine-color-moss-9)" : "var(--mantine-color-wheat-9)";

  return (
    <Group>
      <motion.rect
        width={width}
        height={height - 30}
        className={classes.rangeHighlight}
        variants={variants}
        animate={increased ? "increased" : "decreased"}
      />
      <Group transform={`translate(-60 200) rotate(-90)`}>
        <foreignObject width={200} height={60}>
          <MotionNumberFlow
            value={range.line.low.x.getFullYear()}
            className={classes.rangeHighlightYear}
            format={{ useGrouping: false }}
          />
        </foreignObject>
      </Group>

      <Group left={0} top={10}>
        <foreignObject width={width} height={height}>
          <Stack>
            <Stack gap={0} p={0} m={0}>
              <RangeItem value={range.bar.high.y} label="added" color={color} />
              <RangeItem value={range.line.high.y} label="total" color={color} />
              <RangeItem value={percentage} label="% increase" color={color} style="percent" />

              <Center>
                <MotionArrowUp
                  strokeWidth={3}
                  transition={{
                    rotate: { type: "spring", duration: 0.5, bounce: 0 },
                  }}
                  animate={{
                    rotate: increased ? 0 : -180,
                    color,
                  }}
                />
              </Center>

              <Center>
                <motion.p className={classes.rangeHighlightDetails} animate={{ color }}>
                  year on year
                </motion.p>
              </Center>
            </Stack>
          </Stack>
        </foreignObject>
      </Group>

      <Group transform={`translate(${width + 60}) rotate(90)`}>
        <foreignObject width={200} height={60}>
          <MotionNumberFlow
            value={range.line.high.x.getFullYear()}
            className={classes.rangeHighlightYear}
            format={{ useGrouping: false }}
          />
        </foreignObject>
      </Group>
    </Group>
  );
}

interface RangeItemProps {
  value: number;
  label: string;
  color: string;
  style?: string;
}

function RangeItem({ value, label, color, style }: RangeItemProps) {
  return (
    <>
      <Center>
        <MotionNumberFlow
          value={value}
          className={classes.rangeHighlightDetailsNumber}
          animate={{ color }}
          format={{ style: style || "decimal", maximumFractionDigits: 0 }}
        />
      </Center>
      <Center>
        <motion.p className={classes.rangeHighlightDetails} animate={{ color }}>
          {label}
        </motion.p>
      </Center>
    </>
  );
}
