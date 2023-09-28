'use client';

import * as d3 from "d3";
import { SVGProps } from "react";
import { useElementSize } from "@mantine/hooks";
import { Box, BoxProps } from "@mantine/core";


function tachoAngle(value: number) {
  return (Math.PI * (value / 100)) - (Math.PI / 2);
}

interface ArcProps {
  startAngle: number,
  endAngle: number,
  innerRadius: number,
  outerRadius: number,
}

function Arc(props: ArcProps & SVGProps<SVGPathElement>) {
  // unwrap properties for convenience
  const {
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    ...rest
  } = props;

  const start = tachoAngle(startAngle);
  const end = tachoAngle(endAngle);

  const arcGenerator = d3.arc();
  const slicePath = arcGenerator({
    innerRadius,
    outerRadius,
    startAngle: start,
    endAngle: end,
  });

  return (
    <g>
      <path d={slicePath || undefined} {...rest} />
    </g>
  )
};


interface Threshold {
  name: string,
  color: string,
  start: number,
  end: number,
}

function thresholdColor(value: number, thresholds: Threshold[]) {
  for (const threshold of thresholds) {
    if (value >= threshold.start && value <= threshold.end) {
      return threshold.color;
    }
  }
}

interface TachoChartProps {
  thresholds: Threshold[],
  value: number,
}

export function TachoChart({ thresholds, value, ...rest }: TachoChartProps & BoxProps) {
  const { ref, width, height } = useElementSize();

  const radius = Math.min(width, height) / 2;
  const valueColor = thresholdColor(value, thresholds)

  return (
    <Box ref={ref} {...rest}>
      <svg width={width} height={height} viewBox={[-width/2, -height/2, width, height].join(' ')}>
        { thresholds.map((threshold, idx) => (
          <Arc
            key={idx}
            startAngle={threshold.start}
            endAngle={threshold.end}
            innerRadius={70}
            outerRadius={radius}
            fill={threshold.color}
            opacity={0.3}
          />
        ))}
        <Arc
          startAngle={0}
          endAngle={value}
          innerRadius={70}
          outerRadius={radius}
          fill={valueColor}
        />
        <text
          fontSize={40}
          textAnchor="middle"
          alignmentBaseline="central"
        >
          {value}%
        </text>
      </svg>
    </Box>
  );
};
