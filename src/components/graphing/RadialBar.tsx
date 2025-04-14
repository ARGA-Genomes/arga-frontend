"use client";

import classes from "./RadialBar.module.css";

import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { scaleLinear, scaleBand } from "@visx/scale";
import { Arc, Circle } from "@visx/shape";
import { Text } from "@visx/text";
import { max, min, ScaleLinear } from "d3";
import { ArcProps } from "@visx/shape/lib/shapes/Arc";
import { CircleClipPath } from "@visx/clip-path";
import { useId } from "react";

export interface RadialBarDatum {
  label: string;
  value: number;
  total: number;
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
            cornerRadius={radius <= target ? 4 : 0}
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
          <Text y={-props.scale(threshold.target) + labelOffset} className={classes.gridLabel}></Text>
        </Group>
      ))}
      <Circle r={props.innerRadius} className={classes.gridCenter} />
    </>
  );
}

export function asPercentage(data: RadialBarDatum[]) {
  return data.map((datum) => ({
    label: datum.label,
    value: (datum.value / datum.total) * 100 || 0,
    total: 100,
  }));
}

interface RadialGraphProps {
  data: RadialBarDatum[];
  onHover?: (item: RadialBarDatum | null) => void;
  children?: React.ReactNode;
}

export function RadialGraph({ data, onHover, children }: RadialGraphProps) {
  const innerRadiusClipId = useId();

  const margin = { top: 20, bottom: 20, left: 20, right: 20 };
  const maxTotal = max(data, (d) => d.total) ?? 0;

  const thresholds = [
    { label: "100%", target: maxTotal, className: classes.grid100, altClassName: classes.arc100 },
    { label: "75%", target: maxTotal * 0.75, className: classes.grid75, altClassName: classes.arc75 },
    { label: "50%", target: maxTotal * 0.5, className: classes.grid50, altClassName: classes.arc50 },
    { label: "25%", target: maxTotal * 0.25, className: classes.grid25, altClassName: classes.arc25 },
  ];

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
          domain: [0, maxTotal],
        });

        return (
          <svg width={width} height={height}>
            <CircleClipPath id={innerRadiusClipId} r={innerRadius} />

            <Group top={yMax / 2 + margin.top} left={xMax / 2 + margin.left}>
              <Group clipPath={`url(#${innerRadiusClipId})`}>{children}</Group>

              {data.map((d, idx) => {
                const startAngle = xScale(d.label) ?? 0;
                const endAngle = startAngle + xScale.bandwidth();
                const outerRadius = yScale(d.total) ?? 0;

                return (
                  <Group
                    key={idx}
                    className={classes.group}
                    onMouseOver={() => onHover && onHover(d)}
                    onMouseOut={() => onHover && onHover(null)}
                  >
                    <Arc
                      startAngle={startAngle}
                      endAngle={endAngle}
                      innerRadius={innerRadius}
                      outerRadius={outerRadius}
                      cornerRadius={4}
                      className={classes.arc}
                      fill="url(#radial-lines)"
                    />
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
