'use client';

import * as d3 from "d3";
import { useSpring, animated } from '@react-spring/web'
import { SVGProps, useState } from "react";
import { useElementSize } from "@mantine/hooks";
import { Box, BoxProps } from "@mantine/core";


const MARGIN = { top: 10, right: 10, bottom: 10, left: 10 };


interface Rect {
  x: number,
  y: number,
  width: number,
  height: number,
}


interface BarProps {
  rect: Rect,
  data: BarDatum,
  highlight: boolean,
  onHighlight: (datum: BarDatum | undefined) => void,
}

function Bar(props: BarProps & SVGProps<SVGRectElement>)
{
  // unwrap properties for convenience
  const {
    rect,
    data,
    highlight,
    onHighlight,
    ...rest
  } = props;

  const anim = useSpring({
    from: { opacity: highlight ? 0.3 : 1 },
    to: { opacity: highlight ? 1 : 0.3 },
  });

  return (
    <animated.g style={anim}>
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        onMouseEnter={() => {onHighlight(data)}}
        onMouseLeave={() => {onHighlight(undefined)}}
        {...rest}
      />
      <text
        x={rect.x + 7}
        y={rect.y + (rect.height / 2)}
        textAnchor="start"
        alignmentBaseline="central"
        fontSize={12}
      >
        {data.name}
      </text>
      <text
        x={rect.width - 7}
        y={rect.y + (rect.height / 2)}
        textAnchor="end"
        alignmentBaseline="central"
        fontSize={12}
        opacity={rect.width > 100 ? 1 : 0}
      >
        {data.value}
      </text>
    </animated.g>
  )
};


interface GridLineProps {
  x1: number,
  x2: number,
  y1: number,
  y2: number,
}

function GridLine({ value, x1, x2, y1, y2, ...rest }: GridLineProps & any) {
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
  )
}


interface BarDatum {
  name: string,
  value: number,
}

interface BarChartProps {
  data: BarDatum[],
  spacing?: number,
}

export function BarChart({ data, spacing, ...rest }: BarChartProps & BoxProps) {
  const { ref, width, height } = useElementSize();

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [highlighted, setHighlighted] = useState<BarDatum|undefined>();

  const groups = data.sort((a, b) => b.value - a.value).map(d => d.name);
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
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

  return (
    <Box ref={ref} {...rest}>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
        { grid.map((value, idx) => (
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
        { data.map((datum, idx) => (
          <Bar
            key={idx}
            rect={{
              x: xScale(0),
              y: yScale(datum.name) || 0,
              width: xScale(datum.value),
              height: yScale.bandwidth(),
            }}
            data={datum}
            rx={5}
            opacity={0.8}
            fill={color(idx.toString()) as string}
            highlight={highlighted === undefined || highlighted.name == datum.name}
            onHighlight={setHighlighted}
          />
        ))}
        </g>
      </svg>
    </Box>
  );
};
