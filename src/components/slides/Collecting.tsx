import { Divider, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { DataTable } from "../data-table";
import { IconSpecimenCollection } from "../ArgaIcons";

export function CollectingSlide() {
  return (
    <Group wrap="nowrap">
      <Stack justify="space-between" align="center" h="100%">
        <DataTable>
          <DataTable.Row label="Event date"></DataTable.Row>
        </DataTable>
        <IconSpecimenCollection size={200} />
      </Stack>
      <Divider orientation="vertical" mx="md" />
      <SimpleGrid cols={2} w="100%">
        <Stack>
          <EventDetails />
          <Collecting />
          <Location />
        </Stack>
        <Stack>
          <Publication />
          <Identification />
          <Details />
        </Stack>
      </SimpleGrid>
    </Group>
  );
}

function EventDetails() {
  return (
    <Paper radius="xl" bg="midnight.0" p="md" shadow="none">
      <DataTable>
        <DataTable.Row label="ARGA event ID"></DataTable.Row>
        <DataTable.Row label="Event date"></DataTable.Row>
      </DataTable>
    </Paper>
  );
}

function Collecting() {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Field collecting
      </Text>
      <DataTable>
        <DataTable.Row label="Field number"></DataTable.Row>
        <DataTable.Row label="Registered as"></DataTable.Row>
        <DataTable.Row label="Field habitat"></DataTable.Row>
        <DataTable.Row label="Sampling protocol"></DataTable.Row>
        <DataTable.Row label="Sample size"></DataTable.Row>
        <DataTable.Row label="Field notes"></DataTable.Row>
      </DataTable>
    </Stack>
  );
}

function Location() {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Field location
      </Text>
      <DataTable>
        <DataTable.Row label="Exact location"></DataTable.Row>
        <DataTable.Row label="Coordinates"></DataTable.Row>
        <DataTable.Row label="Elevation"></DataTable.Row>
        <DataTable.Row label="Depth"></DataTable.Row>
        <DataTable.Row label="Collected by"></DataTable.Row>
        <DataTable.Row label="Location generalisation"></DataTable.Row>
      </DataTable>
    </Stack>
  );
}

function Publication() {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Publication source
      </Text>
      <Text>publication</Text>
      <Text>doi</Text>
    </Stack>
  );
}

function Identification() {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Field identification
      </Text>
      <DataTable>
        <DataTable.Row label="Organism name"></DataTable.Row>
        <DataTable.Row label="Identified by"></DataTable.Row>
        <DataTable.Row label="Identification date"></DataTable.Row>
      </DataTable>
    </Stack>
  );
}

function Details() {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Collecting details
      </Text>
      <DataTable>
        <DataTable.Row label="Organism quantity"></DataTable.Row>
        <DataTable.Row label="Sex"></DataTable.Row>
        <DataTable.Row label="Life stage"></DataTable.Row>
        <DataTable.Row label="Reproductive condition"></DataTable.Row>
        <DataTable.Row label="Establishment"></DataTable.Row>
        <DataTable.Row label="Host organism"></DataTable.Row>
        <DataTable.Row label="Fixation"></DataTable.Row>
        <DataTable.Row label="Specimen disposition"></DataTable.Row>
      </DataTable>
    </Stack>
  );
}
