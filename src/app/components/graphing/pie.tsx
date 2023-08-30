'use client';

import * as d3 from "d3";
import { useSpring, animated } from '@react-spring/web'
import { SVGProps, useState } from "react";
import { useElementSize } from "@mantine/hooks";
import { Box, BoxProps } from "@mantine/core";


const MARGIN_X = 150;
const MARGIN_Y = 50;
const INFLEXION_PADDING = 20;


interface ArcProps {
  startAngle: number,
  endAngle: number,
  innerRadius: number,
  outerRadius: number,
  data: PieDatum,
  highlight: boolean,
  onHighlight: (datum: PieDatum | undefined) => void,
}

function Arc(props: ArcProps & SVGProps<SVGPathElement>) {
  // unwrap properties for convenience
  const {
    data,
    highlight,
    onHighlight,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    ...rest
  } = props;

  const anim = useSpring({
    from: { opacity: highlight ? 0.3 : 1 },
    to: { opacity: highlight ? 1 : 0.3 },
  });

  const arcGenerator = d3.arc();
  const slicePath = arcGenerator(props) || undefined;

  return (
    <animated.g style={anim}>
      <path
        d={slicePath}
        onMouseEnter={() => {onHighlight(data)}}
        onMouseLeave={() => {onHighlight(undefined)}}
        {...rest}
      />
    </animated.g>
  )
};

function LabelledArc(props: ArcProps & SVGProps<SVGPathElement>) {
  // unwrap properties for convenience
  const {
    data,
    highlight,
    onHighlight,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    ...rest
  } = props;

  const anim = useSpring({
    from: { opacity: highlight ? 0.3 : 1 },
    to: { opacity: highlight ? 1 : 0.3 },
  });

  const arcGenerator = d3.arc();

  // get the slice info from the component attrs
  const centroid = arcGenerator.centroid(props);
  const slicePath = arcGenerator(props) || undefined;

  // the label
  const inflexionInfo = {
    innerRadius: outerRadius + INFLEXION_PADDING,
    outerRadius: outerRadius + INFLEXION_PADDING,
    startAngle: startAngle,
    endAngle: endAngle,
  };

  const inflexionPoint = arcGenerator.centroid(inflexionInfo);

  const isRightLabel = inflexionPoint[0] > 0;
  const labelPosX = inflexionPoint[0] + 50 * (isRightLabel ? 1 : -1);
  const textAnchor = isRightLabel ? "start" : "end";
  const label = data.name + " (" + data.value + ")";

  return (
    <animated.g style={anim}>
      <path
        d={slicePath}
        onMouseEnter={() => {onHighlight(data)}}
        onMouseLeave={() => {onHighlight(undefined)}}
        {...rest}
      />
      <circle cx={centroid[0]} cy={centroid[1]} r={2} />
      <line
        x1={centroid[0]}
        y1={centroid[1]}
        x2={inflexionPoint[0]}
        y2={inflexionPoint[1]}
        stroke={"black"}
        fill={"black"}
      />
      <line
        x1={inflexionPoint[0]}
        y1={inflexionPoint[1]}
        x2={labelPosX}
        y2={inflexionPoint[1]}
        stroke={"black"}
        fill={"black"}
      />
      <text
        x={labelPosX + (isRightLabel ? 2 : -2)}
        y={inflexionPoint[1]}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        fontSize={14}
      >
        {label}
      </text>
    </animated.g>
  );
};


interface PieDatum {
  name: string,
  value: number,
}

interface PieChartProps {
  data: PieDatum[],
  labelled?: boolean,
}

export function PieChart({ data, labelled, ...rest }: PieChartProps & BoxProps) {
  const { ref, width, height } = useElementSize();

  const [highlighted, setHighlighted] = useState<PieDatum|undefined>();
  const radius = Math.min(width - 2 * MARGIN_X, height - 2 * MARGIN_Y) / 2;

  const pieGenerator = d3.pie<PieDatum>().value(d => d.value);
  const arcs = pieGenerator(data);

  const color = d3
    .scaleOrdinal()
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

  return (
    <Box ref={ref} {...rest}>
      <svg width={width} height={height} viewBox={[-width/2, -height/2, width, height].join(' ')}>
        { arcs.map((arc, idx) => {
          const props = {
            data: arc.data,
            startAngle: arc.startAngle,
            endAngle: arc.endAngle,
            innerRadius: 0,
            outerRadius: radius,
            fill: color(idx.toString()) as string,
            highlight: highlighted === undefined || highlighted.name == arc.data.name,
            onHighlight: setHighlighted,
          };
          return labelled ? <LabelledArc key={idx} {...props}/> : <Arc key={idx} {...props} />
        })}
      </svg>
    </Box>
  );
};
