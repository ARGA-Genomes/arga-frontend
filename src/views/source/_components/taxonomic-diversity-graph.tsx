import { KingdomPhylumCount } from "@/generated/types";
import { Box, Group as MantineGroup, Text, Tooltip } from "@mantine/core";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLog, scaleOrdinal } from "@visx/scale";
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
  // Filter out Virus and Bacteria, and define kingdom ordering
  const filteredData = data.filter((d) => d.kingdom !== "Virus" && d.kingdom !== "Bacteria");
  const kingdomOrder = ["Animalia", "Plantae", "Fungi", "Chromista", "Protista"];
  const [highlighted, setHighlighted] = useState<KingdomPhylumCount | undefined>();

  const colourScale = scaleOrdinal<string, string>({
    domain: kingdomOrder,
    range: [
      "var(--mantine-color-shellfish-5)", // Animalia
      "var(--mantine-color-moss-5)", // Plantae
      "var(--mantine-color-bushfire-5)", // Fungi
      "var(--mantine-color-bushfire-9)", // Chromista
      "var(--mantine-color-wheat-5)", // Protista
    ],
  });

  return (
    <Box style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Legend - fixed height at top */}
      <Box mb="sm">
        <MantineGroup gap="md" justify="center">
          {kingdomOrder
            .filter((kingdom) => filteredData.some((d) => d.kingdom === kingdom))
            .map((kingdom) => (
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
            const topMargin = 20; // Add top margin for the highest y-axis label
            const bottomMargin = 100; // Bottom margin for x-axis labels

            // Sort data by kingdom order, then by phylum name
            const sortedData = filteredData.sort((a, b) => {
              const aKingdomIndex = kingdomOrder.indexOf(a.kingdom);
              const bKingdomIndex = kingdomOrder.indexOf(b.kingdom);
              if (aKingdomIndex !== bKingdomIndex) {
                return aKingdomIndex - bKingdomIndex;
              }
              return a.phylum.localeCompare(b.phylum);
            });

            const xScale = scaleBand({
              range: [leftMargin, chartWidth - sideMargin],
              domain: sortedData.map((stat) => stat.phylum),
              padding: 0.4,
            });

            const maxCount = max(sortedData, (d) => d.count) ?? 1;
            const yScale = scaleLog({
              range: [topMargin, chartHeight - bottomMargin],
              domain: [1, Math.max(10, maxCount)], // Ensure minimum domain of 1 to 10 for log scale
              base: 10,
            });

            // Generate only base 10 tick values (powers of 10)
            const maxPower = Math.ceil(Math.log10(Math.max(10, maxCount)));
            const yTicks = Array.from({ length: maxPower + 1 }, (_, i) => Math.pow(10, i));

            return (
              <svg width={chartWidth} height={chartHeight}>
                {/* Y-axis grid lines and labels */}
                {yTicks.map((tick) => {
                  const yPos = chartHeight - bottomMargin - (yScale(tick) - topMargin);
                  return (
                    <g key={tick}>
                      {/* Grid line */}
                      <Line
                        from={{ x: leftMargin, y: yPos }}
                        to={{ x: chartWidth - sideMargin, y: yPos }}
                        stroke="#f0f0f0"
                        strokeWidth={0.5}
                        opacity={0.7}
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
                {sortedData.map((datum) => {
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
                        <Group top={chartHeight - (yScale(datum.count) - topMargin) - bottomMargin}>
                          <rect
                            width={xScale.bandwidth()}
                            height={yScale(datum.count) - topMargin}
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
                  from={{ x: leftMargin, y: topMargin }}
                  to={{ x: leftMargin, y: chartHeight - bottomMargin + 1 }}
                  stroke="#000"
                  strokeWidth={1}
                />
                <Line
                  from={{ x: leftMargin, y: chartHeight - bottomMargin }}
                  to={{ x: chartWidth - sideMargin, y: chartHeight - bottomMargin }}
                  stroke="#000"
                  strokeWidth={1}
                />

                {/* Custom rotated labels */}
                {sortedData.map((datum) => {
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
