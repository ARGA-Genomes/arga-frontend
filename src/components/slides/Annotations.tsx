import { Annotation } from "@/generated/types";
import { Box, Divider, Group, Paper, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconAnnotation } from "../ArgaIcons";
import { DataTable } from "../data-table";
import { IconStarFilled } from "@tabler/icons-react";
import { ParentSize } from "@visx/responsive";
import { Group as SvgGroup } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { formatNumber } from "@/helpers/formatters";

interface AnnotationSlideProps {
  annotation: Annotation;
}

export function AnnotationSlide({ annotation }: AnnotationSlideProps) {
  return (
    <Stack px="xl">
      <Summary annotation={annotation} />
      <AnnotationDetails annotation={annotation} />
    </Stack>
  );
}

function Summary({ annotation }: { annotation?: Annotation }) {
  return (
    <Group>
      <Paper py="md" px="xl" radius="lg" bg="wheatBg.1" shadow="none">
        <Stack>
          <SummaryItem>{formatNumber(annotation?.numberOfGenes) ?? 0} genes</SummaryItem>
          <SummaryItem>0 transcripts</SummaryItem>
          <SummaryItem>{formatNumber(annotation?.numberOfCodingProteins) ?? 0} proteins</SummaryItem>
        </Stack>
      </Paper>
      <Divider size="sm" orientation="vertical" color="shellfishBg.1" />
      <Stack>
        <Text fw={600} fz="sm" c="midnight.8">
          Gene biotype distribution
        </Text>
        <Box h={100} w="100%">
          {annotation && <DistributionGraph annotation={annotation} />}
        </Box>
      </Stack>
    </Group>
  );
}

function SummaryItem({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme();

  return (
    <Group>
      <IconStarFilled color={theme.colors.wheat[3]} />
      <Text fz="lg" fw={650} c="midnight.7">
        {children}
      </Text>
    </Group>
  );
}

function AnnotationDetails({ annotation }: { annotation?: Annotation }) {
  return (
    <Stack>
      <DataTable>
        <DataTable.RowValue label="Annotation source">{annotation?.provider}</DataTable.RowValue>
        <DataTable.RowValue label="Annotation date">{annotation?.eventDate}</DataTable.RowValue>
        <DataTable.RowValue label="Annotation status" />
        <DataTable.RowValue label="Gene naming conventions" />
      </DataTable>
      <Group>
        <IconAnnotation size={200} />
      </Group>
    </Stack>
  );
}

function DistributionGraph({ annotation }: { annotation: Annotation }) {
  const theme = useMantineTheme();

  return (
    <ParentSize>
      {(parent) => {
        const width = parent.width;
        const height = parent.height;

        const xScale = scaleLinear<number>({
          range: [0, width],
          domain: [0, 100],
        });

        const yScale = scaleBand<string>({
          range: [0, height],
          domain: ["protein-coding", "non-coding", "pseudogenes", "other"],
          padding: 0.3,
        });

        return (
          <svg width={width} height={height}>
            <SvgGroup left={75}>
              <AxisLeft
                scale={yScale}
                hideTicks
                tickLabelProps={{
                  fill: theme.colors.midnight[7],
                  fontSize: 9,
                  fontWeight: 700,
                  textAnchor: "end",
                }}
              />

              <rect
                x={0}
                y={yScale("protein-coding")}
                height={yScale.bandwidth()}
                width={xScale(annotation.numberOfCodingProteins ?? 0)}
                fill={theme.colors.shellfishBg[5]}
              />

              <rect
                x={0}
                y={yScale("non-coding")}
                height={yScale.bandwidth()}
                width={xScale(annotation.numberOfNonCodingProteins ?? 0)}
                fill={theme.colors.shellfishBg[5]}
              />

              <rect
                x={0}
                y={yScale("pseudogenes")}
                height={yScale.bandwidth()}
                width={xScale(annotation.numberOfPseudogenes ?? 0)}
                fill={theme.colors.shellfishBg[5]}
              />

              <rect
                x={0}
                y={yScale("other")}
                height={yScale.bandwidth()}
                width={xScale(annotation.numberOfOtherGenes ?? 0)}
                fill={theme.colors.shellfishBg[5]}
              />

              <SvgGroup top={height - 1}>
                <AxisBottom scale={xScale} hideTicks tickValues={[]} />
              </SvgGroup>
            </SvgGroup>
          </svg>
        );
      }}
    </ParentSize>
  );
}
