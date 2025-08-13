import classes from "./SimpleVerticalBarGraph.module.css";

import { Group } from "@visx/group";
import { ScaleBand } from "d3";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Line } from "@visx/shape";

interface SimpleVerticalBarGraphProps<TypeX, TypeY extends { toString(): string }, Datum> {
  width: number;
  height: number;
  xScale: (x: TypeX) => number | undefined;
  yScale: ScaleBand<TypeY>;
  data: Datum[];

  getX: (datum: Datum) => TypeX;
  getY: (datum: Datum) => TypeY;
}

export default function SimpleVerticalBarGraph<TypeX, TypeY extends { toString(): string }, Datum>({
  width,
  height,
  data,
  xScale,
  yScale,
  getX,
  getY,
}: SimpleVerticalBarGraphProps<TypeX, TypeY, Datum>) {
  const axisWidth = 100;

  return (
    <svg width={width} height={height}>
      {data.map((datum) => {
        const x = xScale(getX(datum)) ?? 0;
        const y = yScale(getY(datum));

        return (
          <Group left={axisWidth} top={y} key={getY(datum).toString()}>
            <rect className={classes.simpleBar} width={x} height={yScale.bandwidth()}></rect>
          </Group>
        );
      })}

      <AxisLeft
        left={axisWidth}
        scale={yScale}
        hideTicks
        labelOffset={0}
        axisLineClassName={classes.axisLine}
        labelClassName={classes.axisLine}
      />
      <Group top={height - 20}>
        <Line from={{ x: axisWidth, y: 0 }} to={{ x: width, y: 0 }} className={classes.axisLine} />
      </Group>
    </svg>
  );
}
