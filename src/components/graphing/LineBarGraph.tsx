"use client";

import classes from "./LineBarGraph.module.css";

import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisBottom, AxisLeft, AxisRight } from "@visx/axis";
import { LinePath, Bar } from "@visx/shape";
import { curveNatural } from "@visx/curve";
import { Grid } from "@visx/grid";
import { max, ScaleBand } from "d3";

export interface LineDatum {
  x: number;
  y: number;
}

export interface BarDatum {
  x: number;
  y: number;
}

interface LineBarGraphProps {
  lineData: LineDatum[];
  barData: BarDatum[];
}

export function LineBarGraph({ lineData, barData }: LineBarGraphProps) {
  const lineMax = max(lineData, (d) => d.y) ?? 0;
  const barMax = max(barData, (d) => d.y) ?? 0;
  /* domain: [lineData[0]?.x, lineData[lineData.length - 1]?.x], */

  return (
    <ParentSize>
      {(parent) => {
        const xScale = scaleBand<number>({
          range: [0, parent.width - 100],
          domain: lineData.map((d) => d.x),
        });

        const yScale = scaleLinear<number>({
          range: [parent.height - 40, 0],
          domain: [0, lineMax],
        });

        const y2Scale = scaleLinear<number>({
          range: [parent.height - 40, 0],
          domain: [0, barMax],
        });

        return (
          <svg width={parent.width} height={parent.height}>
            <Group left={50} top={10}>
              <Grid
                xScale={xScale}
                yScale={yScale}
                width={parent.width - 100}
                height={parent.height}
                numTicksRows={6}
                numTicksColumns={6}
              />

              <AxisBottom
                scale={xScale}
                top={parent.height - 40}
                numTicks={6}
                tickLabelProps={{ className: classes.scaleText }}
              />
              <AxisLeft scale={yScale} numTicks={6} tickLabelProps={{ className: classes.scaleText }} />
              <AxisRight
                scale={y2Scale}
                left={parent.width - 100}
                numTicks={6}
                tickLabelProps={{ className: classes.scaleText }}
              />

              <BarGraph data={barData} x={xScale} y={y2Scale} height={parent.height - 40} />
              <LineGraph data={lineData} x={xScale} y={yScale} />
            </Group>
          </svg>
        );
      }}
    </ParentSize>
  );
}

interface LineGraphProps {
  data: LineDatum[];
  x: ScaleBand<number>;
  y: (y: number) => number;
}

function LineGraph({ data, x, y }: LineGraphProps) {
  return (
    <Group>
      <LinePath data={data} x={(d) => x(d.x) ?? 0} y={(d) => y(d.y)} className={classes.line} curve={curveNatural} />
      {data.map((d) => (
        <circle key={d.x} r={6} cx={x(d.x)} cy={y(d.y)} className={classes.lineDot} />
      ))}
    </Group>
  );
}

interface BarGraphProps {
  data: BarDatum[];
  x: ScaleBand<number>;
  y: (y: number) => number;
  height: number;
}

function BarGraph({ data, x, y, height }: BarGraphProps) {
  const gap = x.bandwidth() / 10.0;

  return (
    <>
      {data.map((d) => (
        <Bar
          x={(x(d.x) ?? 0) + gap}
          y={y(d.y)}
          width={x.bandwidth() - gap - gap}
          height={height - y(d.y)}
          className={classes.bar}
          key={d.x}
        />
      ))}
    </>
  );
}
