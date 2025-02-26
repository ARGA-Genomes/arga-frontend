"use client";

import classes from "./RadialBar.module.css";

import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { scaleLinear, scaleBand } from "@visx/scale";
import { Arc, Circle } from "@visx/shape";
import { Text } from "@visx/text";
import { max, min, ScaleLinear } from "d3";
import { useState } from "react";
import { ArcProps } from "@visx/shape/lib/shapes/Arc";

export interface RadialBarDatum {
  label: string;
  value: number;
}

/* const toDegrees = (x: number) => (x * 180) / Math.PI; */

interface Thresholds {
  label: string;
  target: number;
  className: string;
  altClassName: string;
}

interface ThresholdArcProps extends ArcProps<number> {
  thresholds: Thresholds[];
  value: number;
  scale: ScaleLinear<number, number>;
  innerRadius: number;
}

export function ThresholdArc(props: ThresholdArcProps) {
  const radius = props.scale(props.value) ?? 0;
  const minThreshold = min(props.thresholds, (threshold) => props.scale(threshold.target)) ?? 0;

  return (
    <>
      {props.thresholds.map((threshold) => {
        const target = props.scale(threshold.target);
        return (
          <Arc
            key={threshold.label}
            {...(props as ArcProps<number>)}
            cornerRadius={radius < target ? 4 : 0}
            outerRadius={min([target, radius])}
            innerRadius={min([props.innerRadius, minThreshold])}
            className={threshold.altClassName}
          />
        );
      })}
    </>
  );
}

interface ThresholdGridProps {
  thresholds: Thresholds[];
  scale: (value: number) => number;
  innerRadius: number;
}

export function ThresholdGrid(props: ThresholdGridProps) {
  const labelOffset = 14;

  return (
    <>
      {props.thresholds.map((threshold) => (
        <Group key={threshold.label}>
          <Circle r={props.scale(threshold.target)} className={threshold.className} />
          <Text y={-props.scale(threshold.target) + labelOffset} className={classes.gridLabel}>
            {threshold.label}
          </Text>
        </Group>
      ))}
      <Circle r={props.innerRadius} className={classes.gridCenter} />
    </>
  );
}

interface RadialGraphProps {
  data: RadialBarDatum[];
  showGrid?: boolean;
  interactive?: boolean;
}

export function RadialGraph({ data, showGrid, interactive }: RadialGraphProps) {
  const [hoverItem, setHoverItem] = useState<RadialBarDatum | null>(null);
  const margin = { top: 20, bottom: 20, left: 20, right: 20 };
  const maxCount = max(data, (d) => d.value) ?? 0;

  const thresholds = [
    { label: "100%", target: maxCount, className: classes.grid100, altClassName: classes.arc100 },
    { label: "75%", target: maxCount * 0.75, className: classes.grid75, altClassName: classes.arc75 },
    { label: "50%", target: maxCount * 0.5, className: classes.grid50, altClassName: classes.arc50 },
    { label: "25%", target: maxCount * 0.25, className: classes.grid25, altClassName: classes.arc25 },
  ];
  /* <Text x={textX} y={textY} angle={toDegrees(midAngle)} className={classes.text}>
                  {d.label}
                  </Text> */

  return (
    <ParentSize>
      {(parent) => {
        // bounds
        const width = parent.width;
        const height = parent.height;

        const xMax = width - margin.left - margin.right;
        const yMax = height - margin.top - margin.bottom;
        const radiusMax = Math.min(xMax, yMax) / 2;
        const innerRadius = radiusMax / 3;

        const xScale = scaleBand<string>({
          range: [0, 2 * Math.PI],
          domain: data.map((d) => d.label),
          padding: 0.2,
        });

        const yScale = scaleLinear<number>({
          range: [innerRadius, radiusMax],
          domain: [-10, maxCount],
        });

        return (
          <svg width={width} height={height}>
            <Group top={yMax / 2 + margin.top} left={xMax / 2 + margin.left}>
              {showGrid && <ThresholdGrid thresholds={thresholds} scale={yScale} innerRadius={innerRadius} />}

              <Text className={classes.text}>{hoverItem?.label}</Text>
              <Text y={22} className={classes.text}>
                {hoverItem?.value}
              </Text>

              {data.map((d) => {
                const startAngle = xScale(d.label) ?? 0;
                const endAngle = startAngle + xScale.bandwidth();

                return (
                  <Group
                    key={d.label}
                    className={classes.group}
                    onMouseOver={() => interactive && setHoverItem(d)}
                    onMouseOut={() => interactive && setHoverItem(null)}
                  >
                    <ThresholdArc
                      thresholds={thresholds}
                      value={d.value}
                      scale={yScale}
                      startAngle={startAngle}
                      endAngle={endAngle}
                      innerRadius={innerRadius}
                    />
                  </Group>
                );
              })}
            </Group>
          </svg>
        );
      }}
    </ParentSize>
  );
}
