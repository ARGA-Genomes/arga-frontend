"use client";

import * as d3 from "d3";
import { useElementSize } from "@mantine/hooks";
import { Box, BoxProps } from "@mantine/core";

const MARGIN = { top: 10, right: 10, bottom: 20, left: 10 };

interface GridLineProps {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

function GridLine({
  value,
  x1,
  x2,
  y1,
  y2,
  ...rest
}: GridLineProps & { value: number }) {
  return (
    <g>
      <line x1={x1} x2={x2} y1={y1} y2={y2} {...rest} />
      <text
        x={x1}
        y={y2 + 10}
        textAnchor="middle"
        alignmentBaseline="central"
        fontSize="10"
      >
        {value}
      </text>
    </g>
  );
}

interface LineDatum {
  name: string;
  points: number[];
  color?: string;
}

interface LineChartProps {
  data: LineDatum[];
}

export function LineChart({ data, ...rest }: LineChartProps & BoxProps) {
  const { ref, width, height } = useElementSize();

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((d) => d3.max(d.points) || 0)) || 0])
    .range([boundsHeight, 0]);

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((d) => d.points.length)) || 0])
    .range([0, boundsWidth]);

  const line = d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]));

  const gridX = xScale.ticks(data[0].points.length / 100).slice(1);
  const gridY = yScale.ticks(5).slice(1);

  return (
    <Box my={10} ref={ref} {...rest}>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {gridX.map((value, idx) => (
            <GridLine
              key={idx}
              value={value}
              x1={xScale(value)}
              x2={xScale(value)}
              y1={0}
              y2={boundsHeight}
              stroke="grey"
              opacity={0.3}
            />
          ))}
          {gridY.map((value, idx) => (
            <GridLine
              key={idx}
              value={value}
              x1={0}
              x2={boundsWidth}
              y1={yScale(value)}
              y2={yScale(value)}
              stroke="grey"
              opacity={0.3}
            />
          ))}
          {data.map((datum, idx) => (
            <path
              key={idx}
              stroke={datum.color}
              strokeWidth={1.5}
              fill="none"
              d={line(datum.points.map((p, i) => [i, p])) || undefined}
            />
          ))}
        </g>
      </svg>
    </Box>
  );
}
