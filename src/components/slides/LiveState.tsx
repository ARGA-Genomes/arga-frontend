import { Box, SimpleGrid, Stack, Text } from "@mantine/core";
import { DataTable } from "../data-table";
import { IconLiveState } from "../ArgaIcons";

export function LiveStateSlide() {
  return (
    <Stack>
      <Box h={0} style={{ alignSelf: "flex-end" }}>
        <IconLiveState size={200} />
      </Box>
      <Identification />
      <Disposition />
      <Environment />
      <Provenance />
    </Stack>
  );
}

function Identification() {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Live identification
      </Text>
      <DataTable>
        <DataTable.Row label="Organism name"></DataTable.Row>
        <DataTable.Row label="Scientific name"></DataTable.Row>
        <DataTable.Row label="Identified by"></DataTable.Row>
        <DataTable.Row label="Identification date"></DataTable.Row>
      </DataTable>
    </Stack>
  );
}

function Disposition() {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Live Disposition
      </Text>
      <DataTable>
        <DataTable.Row label="Disposed as"></DataTable.Row>
        <DataTable.Row label="Data first observed"></DataTable.Row>
        <DataTable.Row label="Last known alive"></DataTable.Row>
        <DataTable.Row label="Sex"></DataTable.Row>
      </DataTable>
    </Stack>
  );
}

function Environment() {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Natural environment and location
      </Text>
      <SimpleGrid cols={2}>
        <DataTable>
          <DataTable.Row label="Biome"></DataTable.Row>
          <DataTable.Row label="Source population"></DataTable.Row>
          <DataTable.Row label="Source location"></DataTable.Row>
        </DataTable>
        <DataTable>
          <DataTable.Row label="Habitat"></DataTable.Row>
          <DataTable.Row label="Habitat (original)"></DataTable.Row>
          <DataTable.Row label="Elevation (m)"></DataTable.Row>
          <DataTable.Row label="Depth (m)"></DataTable.Row>
        </DataTable>
      </SimpleGrid>
    </Stack>
  );
}

function Provenance() {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Provenance and holding
      </Text>
      <DataTable>
        <DataTable.Row label="Held at"></DataTable.Row>
        <DataTable.Row label="Holding ID"></DataTable.Row>
        <DataTable.Row label="Permit or ethics code"></DataTable.Row>
      </DataTable>
    </Stack>
  );
}
