import { Box, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { DataTable } from "../data-table";
import { IconLiveState } from "../ArgaIcons";
import { Organism } from "@/generated/types";
import { PublicationDetails } from "./common";

interface LiveStateSlideProps {
  organism: Organism;
}

export function LiveStateSlide({ organism }: LiveStateSlideProps) {
  return (
    <Stack px="xl" pb="xl">
      <Box h={0} style={{ alignSelf: "flex-end" }}>
        <IconLiveState size={200} />
      </Box>
      <Group>
        <Identification organism={organism} />
        <PublicationDetails publication={organism.publication} />
      </Group>
      <Disposition organism={organism} />
      <Environment organism={organism} />
      <Provenance organism={organism} />
    </Stack>
  );
}

function Identification({ organism }: LiveStateSlideProps) {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Live identification
      </Text>
      <DataTable>
        <DataTable.Row label="Organism name"></DataTable.Row>
        <DataTable.Row label="Scientific name"></DataTable.Row>
        <DataTable.Row label="Identified by">{organism.identifiedBy}</DataTable.Row>
        <DataTable.Row label="Identification date">{organism.identificationDate}</DataTable.Row>
      </DataTable>
    </Stack>
  );
}

function Disposition({ organism }: LiveStateSlideProps) {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Live Disposition
      </Text>
      <DataTable>
        <DataTable.Row label="Disposed as">{organism.disposition}</DataTable.Row>
        <DataTable.Row label="Date first observed">{organism.firstObservedAt}</DataTable.Row>
        <DataTable.Row label="Last known alive">{organism.lastKnownAliveAt}</DataTable.Row>
        <DataTable.Row label="Sex">{organism.sex}</DataTable.Row>
      </DataTable>
    </Stack>
  );
}

function Environment({ organism }: LiveStateSlideProps) {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Natural environment and location
      </Text>
      <SimpleGrid cols={2}>
        <DataTable>
          <DataTable.Row label="Biome">{organism.biome}</DataTable.Row>
          <DataTable.Row label="Bioregion">{organism.bioregion}</DataTable.Row>
          <DataTable.Row label="Habitat">{organism.habitat}</DataTable.Row>
          <DataTable.Row label="Source location">{organism.locationSource}</DataTable.Row>
        </DataTable>
        <DataTable>
          <DataTable.Row label="IBRA/IMCRA region">{organism.ibraImcra}</DataTable.Row>
          <DataTable.Row label="Habitat (original)">{organism.habitat}</DataTable.Row>
          <DataTable.Row label="Elevation (m)"></DataTable.Row>
          <DataTable.Row label="Depth (m)"></DataTable.Row>
        </DataTable>
      </SimpleGrid>
    </Stack>
  );
}

function Provenance({ organism }: LiveStateSlideProps) {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Provenance and holding
      </Text>
      <DataTable>
        <DataTable.Row label="Held at">{organism.holding}</DataTable.Row>
        <DataTable.Row label="Holding ID">{organism.holdingId}</DataTable.Row>
        <DataTable.Row label="Permit or ethics code">{organism.holdingPermit}</DataTable.Row>
      </DataTable>
    </Stack>
  );
}
