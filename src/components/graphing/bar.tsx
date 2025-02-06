"use client";

import * as d3 from "d3";
import { useSpring, animated } from "@react-spring/web";
import { SVGProps, useState } from "react";
import { useElementSize } from "@mantine/hooks";
import { Box, BoxProps, Tooltip } from "@mantine/core";
import Link from "next/link";

const MARGIN = { top: 10, right: 10, bottom: 10, left: 10 };

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BarProps {
  rect: Rect;
  data: BarDatum;
  yAxisWidth?: number;
  highlight: boolean;
  onHighlight: (datum: BarDatum | undefined) => void;
}

function Bar(props: BarProps & SVGProps<SVGRectElement>) {
  // unwrap properties for convenience
  const { rect, data, yAxisWidth, highlight, onHighlight, ...rest } = props;

  const anim = useSpring({
    from: { opacity: highlight ? 0.3 : 1 },
    to: { opacity: highlight ? 1 : 0.3 },
  });

  const bar = (
    <animated.g style={anim}>
      <rect
        x={yAxisWidth}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        onMouseEnter={() => {
          onHighlight(data);
        }}
        onMouseLeave={() => {
          onHighlight(undefined);
        }}
        {...rest}
      />

      <text
        x={0}
        y={rect.y + rect.height / 2}
        fontSize={12}
        fill="url(#truncateText)"
        onMouseEnter={() => {
          onHighlight(data);
        }}
        onMouseLeave={() => {
          onHighlight(undefined);
        }}
      >
        {data.name}
      </text>
    </animated.g>
  );

  return (
    <Tooltip.Floating label={`${data.name} - ${data.value}`} radius="md">
      {data.href ? <Link href={data.href}>{bar}</Link> : bar}
    </Tooltip.Floating>
  );
}

interface BarArcProps {
  data: BarDatum;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  textAnchor?: string;
  labelTransform?: string;
  labelRotation?: string;
  highlight: boolean;
  onHighlight: (datum: BarDatum | undefined) => void;
}

function BarArc(props: BarArcProps & SVGProps<SVGRectElement>) {
  const {
    data,
    textAnchor,
    labelTransform,
    labelRotation,
    highlight,
    onHighlight,
    ...rest
  } = props;

  const anim = useSpring({
    from: { opacity: highlight ? 0.3 : 1 },
    to: { opacity: highlight ? 1 : 0.3 },
  });

  const arcGenerator = d3.arc();
  const slicePath = arcGenerator(props) || undefined;

  const barArc = (
    <animated.g style={anim}>
      <path
        d={slicePath}
        onMouseEnter={() => {
          onHighlight(data);
        }}
        onMouseLeave={() => {
          onHighlight(undefined);
        }}
        {...rest}
      />
      <text
        transform={labelTransform! + labelRotation!}
        textAnchor={textAnchor}
        alignmentBaseline="middle"
        fontSize={14}
        fill="white"
        strokeWidth={0.2}
      >
        {data.name}
      </text>
    </animated.g>
  );

  return (
    <Tooltip.Floating
      label={`${data.name} - ${data.value} records`}
      radius="md"
    >
      {data.href ? <Link href={data.href}>{barArc}</Link> : barArc}
    </Tooltip.Floating>
  );
}

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

interface BarDatum {
  name: string;
  value: number;
  href?: string;
}

interface BarChartProps {
  data: BarDatum[];
  spacing?: number;
  labelWidth?: number;
}

export function BarChart({
  data,
  spacing,
  labelWidth,
  ...rest
}: BarChartProps & BoxProps) {
  const { ref, width, height } = useElementSize();

  const yAxisWidth = labelWidth || 150;
  const boundsWidth = width - 200;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [highlighted, setHighlighted] = useState<BarDatum | undefined>();

  const groups = data.sort((a, b) => b.value - a.value).map((d) => d.name);
  const yScale = d3
    .scaleBand()
    .domain(groups)
    .range([0, boundsHeight])
    .padding(spacing || 0);

  const [_min, max] = d3.extent(data.map((d) => d.value));
  const xScale = d3
    .scaleLinear()
    .domain([0, max || 0])
    .range([0, boundsWidth]);

  const grid = xScale.ticks(5).slice(1);

  const color = d3
    .scaleOrdinal()
    .range(
      d3
        .quantize(
          (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
          data.length === 1 ? 2 : data.length,
        )
        .reverse(),
    );

  return (
    <Box ref={ref} {...rest}>
      <svg width={width} height={height}>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2={yAxisWidth}
          y1="0"
          y2="0"
          id="truncateText"
        >
          <stop offset="70%" stopOpacity="1" />
          <stop offset="100%" stopOpacity="0" />
        </linearGradient>

        <g
          width={boundsWidth}
          height={boundsHeight}
          //transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {grid.map((value, idx) => (
            <GridLine
              key={idx}
              value={value}
              x1={xScale(value) + yAxisWidth}
              x2={xScale(value) + yAxisWidth}
              y1={0}
              y2={boundsHeight}
              stroke="grey"
              opacity={0.3}
            />
          ))}
          {data.map((datum, idx) => (
            <Bar
              key={idx}
              rect={{
                x: xScale(0),
                y: yScale(datum.name) || 0,
                width: xScale(datum.value),
                height: yScale.bandwidth(),
              }}
              yAxisWidth={yAxisWidth}
              data={datum}
              rx={5}
              opacity={0.8}
              fill={color(idx.toString()) as string}
              highlight={
                highlighted === undefined || highlighted.name == datum.name
              }
              onHighlight={setHighlighted}
            />
          ))}
        </g>
      </svg>
    </Box>
  );
}

interface CircularBarChartProps {
  data: BarDatum[];
  margin: number;
}

export function CircularBarChart({
  data,
  margin,
  ...rest
}: CircularBarChartProps & BoxProps) {
  const { ref, width, height } = useElementSize();
  const innerRadius = 50;
  const outerRadius = Math.min(width, height) / 2 - margin;

  const [highlighted, setHighlighted] = useState<BarDatum | undefined>();

  const maxValue = data.reduce((max, current) => {
    return Math.max(max, current.value);
  }, -Infinity);

  const xScale = d3
    .scaleBand()
    .range([0, 2 * Math.PI])
    .padding(0.02)
    .domain(
      data.map(function (d) {
        return d.name;
      }),
    );

  const yScale = d3
    .scaleRadial()
    .range([innerRadius, outerRadius])
    .domain([0, maxValue]);

  const color = d3
    .scaleOrdinal()
    .range(
      d3
        .quantize(
          (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
          data.length === 1 ? 2 : data.length,
        )
        .reverse(),
    );

  return (
    <Box ref={ref} {...rest}>
      <svg
        width={width}
        height={height}
        viewBox={[-width / 2, -height / 2, width, height].join(" ")}
      >
        {data.map((datum, idx) => (
          <BarArc
            key={idx}
            data={datum}
            innerRadius={innerRadius}
            outerRadius={yScale(datum.value)}
            startAngle={xScale(datum.name)!}
            endAngle={xScale(datum.name)! + xScale.bandwidth()}
            textAnchor={
              (xScale(datum.name)! + xScale.bandwidth() / 2 + Math.PI) %
                (2 * Math.PI) <
              Math.PI
                ? "end"
                : "start"
            }
            labelTransform={
              "rotate(" +
              (((xScale(datum.name)! + xScale.bandwidth() / 2) * 180) /
                Math.PI -
                90) +
              ")" +
              "translate(" +
              (yScale(datum.value) + 10) +
              ",0)"
            }
            labelRotation={
              (xScale(datum.name)! + xScale.bandwidth() / 2 + Math.PI) %
                (2 * Math.PI) <
              Math.PI
                ? "rotate(180)"
                : "rotate(0)"
            }
            fill={color(idx.toString()) as string}
            highlight={
              highlighted === undefined || highlighted.name == datum.name
            }
            onHighlight={setHighlighted}
          />
        ))}
      </svg>
    </Box>
  );
}
