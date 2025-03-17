"use client";

import classes from "./LineBarGraph.module.css";

import { Group } from "@visx/group";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AxisBottom, AxisLeft, AxisRight } from "@visx/axis";
import { LinePath, Bar } from "@visx/shape";
import { curveNatural } from "@visx/curve";
import { Grid } from "@visx/grid";
import { max, ScaleTime } from "d3";
import { motion } from "framer-motion";

export interface LineDatum {
  x: Date;
  y: number;
}

export interface BarDatum {
  x1: Date;
  x2: Date;
  y: number;
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

  return (
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
    </Group>
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
