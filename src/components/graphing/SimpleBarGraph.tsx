import classes from "./SimpleBarGraph.module.css";

import { Group } from "@visx/group";
import { ScaleBand } from "d3";
import { AxisBottom } from "@visx/axis";
import { Line } from "@visx/shape";

interface SimpleBarGraphProps<TypeX extends { toString(): string }, TypeY, Datum> {
  width: number;
  height: number;
  xScale: ScaleBand<TypeX>;
  yScale: (y: TypeY) => number | undefined;
  data: Datum[];

  getX: (datum: Datum) => TypeX;
  getY: (datum: Datum) => TypeY;
  tickValues?: TypeX[];
}

export default function SimpleBarGraph<TypeX extends { toString(): string }, TypeY, Datum>({
  width,
  height,
  data,
  xScale,
  yScale,
  getX,
  getY,
  tickValues,
}: SimpleBarGraphProps<TypeX, TypeY, Datum>) {
  return (
    <svg width={width} height={height}>
      {data.map((datum) => {
        const x = xScale(getX(datum));
        const y = yScale(getY(datum)) ?? 0;

        return (
          <Group left={x} key={getX(datum).toString()}>
            <Group top={height - y - 21}>
              <rect className={classes.simpleBar} width={xScale.bandwidth()} height={y}></rect>
            </Group>
          </Group>
        );
      })}

      <Line from={{ x: 1, y: 0 }} to={{ x: 1, y: height - 19 }} className={classes.axisLine} />
      <Group top={height - 20}>
        <AxisBottom
          scale={xScale}
          hideTicks={true}
          tickLength={0}
          labelOffset={2}
          tickValues={tickValues}
          axisLineClassName={classes.axisLine}
          labelClassName={classes.axisLine}
        />
      </Group>
    </svg>
  );
}
