import classes from "./Slide.module.css";

import { Maybe, Publication } from "@/generated/types";
import { Stack, Text, Center, Paper, Group, Box, Divider } from "@mantine/core";
import { Pill } from "../Pills";
import { DataTable } from "../data-table";

export function PublicationDetails({ publication }: { publication?: Publication | null }) {
  return (
    <Stack>
      <Text fw={600} fz="xs" c="midnight.9">
        Data source
      </Text>
      <Text fz="xs" fw={600} c="midnight.7" style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
        {publication?.citation}
      </Text>
      <Center>
        <Text fz="xs" fw={700}>
          {publication?.doi && <Pill.Doi url={publication.doi} />}
        </Text>
      </Center>
    </Stack>
  );
}

interface EventDetailsProps {
  eventDate?: string | Maybe<string>;
  version: string;
}

export function EventDetails({ eventDate, version }: EventDetailsProps) {
  return (
    <Paper radius="xl" bg="midnight.0" py="sm" px="xl" shadow="none" mr="auto">
      <DataTable>
        <DataTable.RowValue label="Event date">{eventDate}</DataTable.RowValue>
        <DataTable.RowValue label="Event version">{version}</DataTable.RowValue>
      </DataTable>
    </Paper>
  );
}

interface SlideNavigationProps<T> {
  icon: React.ReactElement;
  records: T[];
  selected?: T;
  onSelected: (record: T) => void;
  getLabel: (record: T) => string;
  children?: React.ReactElement;
}

export function SlideNavigation<T>({
  icon,
  records,
  selected,
  onSelected,
  getLabel,
  children,
}: SlideNavigationProps<T>) {
  const navWidth = 260;

  return (
    <Group wrap="nowrap" align="flex-start">
      <Box w={0} style={{ alignSelf: "flex-end", position: "relative" }}>
        <Box p={20}>{icon}</Box>
      </Box>

      <Stack w={navWidth} mb={240} mt="md" gap={0}>
        {records.map((record) => (
          <Paper
            maw={navWidth}
            key={getLabel(record)}
            radius="xl"
            shadow="none"
            my={5}
            p="xs"
            bg={record === selected ? "midnight.1" : undefined}
            className={classes.item}
            onClick={() => onSelected(record)}
          >
            <Group wrap="nowrap">
              <Text fz="xs" fw={600} c="midnight.7" truncate="start">
                {getLabel(record)}
              </Text>
            </Group>
          </Paper>
        ))}
      </Stack>

      <Divider orientation="vertical" mx="md" mb="md" size="sm" color="shellfishBg.1" />

      {children}
    </Group>
  );
}
