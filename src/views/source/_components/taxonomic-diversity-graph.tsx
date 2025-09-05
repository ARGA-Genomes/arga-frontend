import { KingdomPhylumCount } from "@/generated/types";
import { Box, Group as MantineGroup, Text, Tooltip } from "@mantine/core";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { Line } from "@visx/shape";
import { Text as VisxText } from "@visx/text";
import { max } from "d3";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface TaxonomicDiversityGraphProps {
  data: KingdomPhylumCount[];
}

export function TaxonomicDiversityGraph({ data }: TaxonomicDiversityGraphProps) {
  // Get unique kingdoms for the color scale
  const kingdoms = Array.from(new Set(data.map((d) => d.kingdom)));
  const [highlighted, setHighlighted] = useState<KingdomPhylumCount | undefined>();

  const colourScale = scaleOrdinal<string, string>({
    domain: kingdoms,
    range: [
      "var(--mantine-color-shellfish-5)",
      "var(--mantine-color-moss-5)",
      "var(--mantine-color-bushfire-5)",
      "var(--mantine-color-bushfire-9)",
      "var(--mantine-color-wheat-5)",
    ],
  });

  return (
    <Box style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Legend - fixed height at top */}
      <Box mb="sm">
        <MantineGroup gap="md" justify="center">
          {kingdoms.map((kingdom) => (
            <MantineGroup key={kingdom} gap="xs" align="center">
              <Box
                w={16}
                h={16}
                style={{
                  backgroundColor: colourScale(kingdom),
                  borderRadius: 4,
                }}
              />
              <Text size="sm">{kingdom}</Text>
            </MantineGroup>
          ))}
        </MantineGroup>
      </Box>

      {/* Chart container - takes remaining space */}
      <Box style={{ flex: 1, minHeight: 0 }}>
        <ParentSize>
          {(parent) => {
            const chartWidth = parent.width;
            const chartHeight = parent.height;
            const sideMargin = 40; // Add padding to sides for rotated labels
            const leftMargin = 60; // Add margin for y-axis labels

            const xScale = scaleBand({
              range: [leftMargin, chartWidth - sideMargin],
              domain: data.map((stat) => stat.phylum),
              padding: 0.4,
            });

            const yScale = scaleLinear({
              range: [0, chartHeight - 100],
              domain: [0, max(data, (d) => d.count) ?? 0],
            });

            // Generate y-axis tick values
            const yTicks = yScale.ticks(5);

            return (
              <svg width={chartWidth} height={chartHeight}>
                {/* Y-axis grid lines and labels */}
                {yTicks.map((tick) => {
                  const yPos = chartHeight - 100 - yScale(tick);
                  return (
                    <g key={tick}>
                      {/* Grid line */}
                      <Line
                        from={{ x: leftMargin, y: yPos }}
                        to={{ x: chartWidth - sideMargin, y: yPos }}
                        stroke="#e0e0e0"
                        strokeWidth={1}
                        opacity={0.5}
                      />
                      {/* Y-axis label */}
                      <VisxText
                        x={leftMargin - 10}
                        y={yPos}
                        fontSize={12}
                        fontWeight={600}
                        textAnchor="end"
                        verticalAnchor="middle"
                      >
                        {tick}
                      </VisxText>
                    </g>
                  );
                })}

                {/* Bars */}
                {data.map((datum) => {
                  const x = xScale(datum.phylum);
                  const y = yScale(datum.count) ?? 0;
                  const isHighlighted = highlighted === undefined || highlighted.phylum === datum.phylum;

                  const bar = (
                    <motion.g
                      animate={{ opacity: isHighlighted ? 1 : 0.3 }}
                      whileHover={{ opacity: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Group left={x} key={datum.phylum}>
                        <Group top={chartHeight - y - 100}>
                          <rect
                            width={xScale.bandwidth()}
                            height={y}
                            fill={colourScale(datum.kingdom)}
                            stroke="none"
                            style={{ cursor: "pointer" }}
                            onMouseEnter={() => setHighlighted(datum)}
                            onMouseLeave={() => setHighlighted(undefined)}
                          />
                        </Group>
                      </Group>
                    </motion.g>
                  );

                  return (
                    <Tooltip.Floating key={datum.phylum} label={`${datum.phylum} - ${datum.count} species`} radius="md">
                      <Link href={`/phylum/${datum.phylum}`}>{bar}</Link>
                    </Tooltip.Floating>
                  );
                })}

                <Line
                  from={{ x: leftMargin, y: 0 }}
                  to={{ x: leftMargin, y: chartHeight - 99 }}
                  stroke="#000"
                  strokeWidth={1}
                />
                <Line
                  from={{ x: leftMargin, y: chartHeight - 100 }}
                  to={{ x: chartWidth - sideMargin, y: chartHeight - 100 }}
                  stroke="#000"
                  strokeWidth={1}
                />

                {/* Custom rotated labels */}
                {data.map((datum) => {
                  const x = xScale(datum.phylum);
                  const centerX = (x || 0) + xScale.bandwidth() / 2;
                  const isHighlighted = highlighted === undefined || highlighted.phylum === datum.phylum;

                  const label = (
                    <motion.g
                      animate={{ opacity: isHighlighted ? 1 : 0.3 }}
                      whileHover={{ opacity: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <VisxText
                        x={centerX}
                        y={chartHeight - 80}
                        fontSize={12}
                        fill="#000"
                        textAnchor="start"
                        transform={`rotate(45, ${centerX}, ${chartHeight - 80})`}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={() => setHighlighted(datum)}
                        onMouseLeave={() => setHighlighted(undefined)}
                      >
                        {datum.phylum}
                      </VisxText>
                    </motion.g>
                  );

                  return (
                    <Tooltip.Floating
                      key={`label-${datum.phylum}`}
                      label={`${datum.phylum} - ${datum.count} species`}
                      radius="md"
                    >
                      <Link href={`/phylum/${datum.phylum}`}>{label}</Link>
                    </Tooltip.Floating>
                  );
                })}
              </svg>
            );
          }}
        </ParentSize>
      </Box>
    </Box>
  );
}
