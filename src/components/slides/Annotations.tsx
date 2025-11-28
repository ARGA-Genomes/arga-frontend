import { Annotation } from "@/generated/types";
import { Group, Paper, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconAnnotation } from "../ArgaIcons";
import { DataTable } from "../data-table";
import { IconStarFilled } from "@tabler/icons-react";

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
    <Paper py="md" px="xl" radius="lg" bg="wheatBg.1" shadow="none">
      <Stack>
        <SummaryItem>{annotation?.numberOfGenes ?? 0} genes</SummaryItem>
        <SummaryItem>0 transcripts</SummaryItem>
        <SummaryItem>{annotation?.numberOfProteins ?? 0} proteins</SummaryItem>
      </Stack>
    </Paper>
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
