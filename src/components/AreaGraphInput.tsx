import * as d3 from "d3";
import { Stack, Text, RangeSlider, Center } from "@mantine/core";
import { AreaClosed } from "@visx/shape";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ParentSize } from "@visx/responsive";
import { curveNatural } from "@visx/curve";
import { useState } from "react";
import { IconArrowBadgeLeftFilled, IconArrowBadgeRightFilled } from "@tabler/icons-react";
import { Group } from "@visx/group";

interface AreaGraphInputProps<Datum> {
  label?: string;
  description?: string;
  value?: [number, number];
  height?: number;
  data: Datum[];
  getX: (d: Datum) => number;
  getY: (d: Datum) => number;
  onChange?: (range: [number, number]) => void;
}

export function AreaGraphInput<Datum>({
  label,
  description,
  value,
  height,
  data,
  getX,
  getY,
  onChange,
}: AreaGraphInputProps<Datum>) {
  const margin = 20;
  const [min, max] = d3.extent(data.map((d) => getX(d)));

  const [range, setRange] = useState<[number, number]>(value ?? [min ?? 0, max ?? 0]);

  return (
    <ParentSize>
      {(parent) => {
        const width = parent.width;
        const h = height ?? 100;
        const innerWidth = width - margin * 2;
        const innerHeight = h - margin;

        const xScale = scaleBand({
          range: [0, innerWidth],
          domain: data.map((d) => getX(d)),
        });
        const yScale = scaleLinear({
          range: [innerHeight, 0],
          domain: [0, (d3.max(data, getY) ?? 0) + 2],
        });

        const slider = scaleLinear({
          range: [0, innerWidth],
          domain: [d3.min(data, getX) ?? 0, d3.max(data, getX) ?? 0],
        });

        return (
          <Stack gap={0}>
            <Text fz="sm" fw={500}>
              {label}
            </Text>
            <Text fz="xs" c="dimmed">
              {description}
            </Text>

            <svg width={width} height={h}>
              <Group left={margin} top={margin}>
                <AreaClosed
                  data={data}
                  x={(d) => xScale(getX(d)) || 0}
                  y={(d) => yScale(getY(d))}
                  yScale={yScale}
                  strokeWidth={2}
                  stroke="var(--mantine-color-moss-5)"
                  fill="var(--mantine-color-moss-1)"
                  curve={curveNatural}
                />
                <rect
                  width={slider(range[0])}
                  height={innerHeight}
                  opacity={0.2}
                  fill="var(--mantine-color-midnight-9)"
                />
                <rect
                  x={slider(range[1])}
                  width={innerWidth - slider(range[1])}
                  height={innerHeight}
                  opacity={0.2}
                  fill="var(--mantine-color-midnight-9)"
                />
              </Group>
            </svg>

            <RangeSlider
              mx={margin}
              color="moss"
              min={min}
              max={max}
              value={range}
              marks={[
                { value: min ?? 0, label: min },
                { value: max ?? 0, label: max },
              ]}
              onChange={(rangeValue) => {
                setRange(rangeValue);
                if (onChange) onChange(rangeValue);
              }}
              thumbSize={24}
              thumbChildren={[<IconArrowBadgeRightFilled key="1" />, <IconArrowBadgeLeftFilled key="2" />]}
            />
            <Center>
              <Text fz="sm" fw={600} c="dimmed">
                {range[0]} - {range[1]}
              </Text>
            </Center>
          </Stack>
        );
      }}
    </ParentSize>
  );
}
