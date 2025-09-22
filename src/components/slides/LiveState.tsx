import { Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { DataTable } from "../data-table";
import { IconLiveState } from "../ArgaIcons";
import { Organism } from "@/generated/types";
import { PublicationDetails } from "./common";
import { Pill } from "../Pills";

interface LiveStateSlideProps {
  organism: Organism;
}

export function LiveStateSlide({ organism }: LiveStateSlideProps) {
  return (
    <Stack px="xl" pb="xl">
      <Group justify="space-between" align="flex-start" grow>
        <Identification organism={organism} />
        <PublicationDetails publication={organism.publication} />
      </Group>
      <Group justify="space-between">
        <Disposition organism={organism} />
        <IconLiveState size={200} />
      </Group>
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
        <DataTable.RowValue label="Organism name"></DataTable.RowValue>
        <DataTable.RowValue label="Scientific name"></DataTable.RowValue>
        <DataTable.RowValue label="Identified by">{organism.identifiedBy}</DataTable.RowValue>
        <DataTable.RowValue label="Identification date">{organism.identificationDate}</DataTable.RowValue>
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
        <DataTable.RowValue label="Disposed as">{organism.disposition}</DataTable.RowValue>
        <DataTable.RowValue label="Date first observed">{organism.firstObservedAt}</DataTable.RowValue>
        <DataTable.RowValue label="Last known alive">{organism.lastKnownAliveAt}</DataTable.RowValue>
        <DataTable.RowValue label="Sex">{organism.sex}</DataTable.RowValue>
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
          <DataTable.RowValue label="Biome">{organism.biome}</DataTable.RowValue>
          <DataTable.RowValue label="Bioregion">{organism.bioregion}</DataTable.RowValue>
          <DataTable.RowValue label="Habitat">{organism.habitat}</DataTable.RowValue>
          <DataTable.RowValue label="Source location">
            {organism.latitude}, {organism.longitude}
            <Group>
              <Pill.CoordinateSystem value={organism.coordinateSystem ?? ""} />
              <Pill.Common value={organism.locationSource ?? ""} />
            </Group>
          </DataTable.RowValue>
        </DataTable>
        <DataTable>
          <DataTable.RowValue label="IBRA/IMCRA region">{organism.ibraImcra}</DataTable.RowValue>
          <DataTable.RowValue label="Habitat (original)">{organism.habitat}</DataTable.RowValue>
          <DataTable.RowValue label="Elevation (m)"></DataTable.RowValue>
          <DataTable.RowValue label="Depth (m)"></DataTable.RowValue>
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
        <DataTable.RowValue label="Held at">{organism.holding}</DataTable.RowValue>
        <DataTable.RowValue label="Holding ID">{organism.holdingId}</DataTable.RowValue>
        <DataTable.RowValue label="Permit or ethics code">{organism.holdingPermit}</DataTable.RowValue>
      </DataTable>
    </Stack>
  );
}
