import { AccessionEvent, CollectionEvent } from "@/generated/types";
import { Box, Divider, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { IconSpecimenCollection } from "../ArgaIcons";
import { DataTable } from "../data-table";

interface CollectingSlideProps {
  collections: CollectionEvent[];
  accessions: AccessionEvent[];
}

export function CollectingSlide({ collections }: CollectingSlideProps) {
  const [collection, setCollection] = useState(collections[0]);

  return (
    <Group wrap="nowrap" align="flex-start">
      <Box w={0} style={{ alignSelf: "flex-end", position: "relative" }}>
        <IconSpecimenCollection size={200} />
      </Box>

      <DataTable w={200}>
        {collections.map((event) => (
          <Paper
            key={event.entityId}
            radius="xl"
            p="xs"
            shadow="none"
            bg={event === collection ? "midnight.1" : "none"}
          >
            <DataTable.Row label="Event date">
              <Text fz="sm" fw={700} c="midnight.9">
                {event.eventDate?.toString() ?? "No date"}
              </Text>
            </DataTable.Row>
          </Paper>
        ))}
      </DataTable>

      <Divider orientation="vertical" mx="md" />

      <SimpleGrid cols={2} w="100%">
        <Stack>
          <EventDetails collection={collection} />
          <Collecting collection={collection} />
          <Location collection={collection} />
        </Stack>
        <Stack>
          <Publication />
          <Identification collection={collection} />
          <Details collection={collection} />
        </Stack>
      </SimpleGrid>
    </Group>
  );
}

function EventDetails({ collection }: { collection: CollectionEvent }) {
  return (
    <Paper radius="xl" bg="midnight.0" p="md" shadow="none">
      <DataTable>
        <DataTable.Row label="ARGA event ID">{collection.entityId}</DataTable.Row>
        <DataTable.Row label="Event date">{collection.eventDate?.toString() ?? "No date"}</DataTable.Row>
      </DataTable>
    </Paper>
  );
}

function Collecting({ collection }: { collection: CollectionEvent }) {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Field collecting
      </Text>
      <DataTable>
        <DataTable.Row label="Field number">{collection.fieldCollectingId}</DataTable.Row>
        <DataTable.Row label="Registered as"></DataTable.Row>
        <DataTable.Row label="Field habitat">{collection.habitat}</DataTable.Row>
        <DataTable.Row label="Sampling protocol"></DataTable.Row>
        <DataTable.Row label="Sample size"></DataTable.Row>
        <DataTable.Row label="Field notes">{collection.fieldNotes}</DataTable.Row>
      </DataTable>
    </Stack>
  );
}

function Location({ collection }: { collection: CollectionEvent }) {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Field location
      </Text>
      <DataTable>
        <DataTable.Row label="Exact location">{collection.locality}</DataTable.Row>
        <DataTable.Row label="Coordinates">
          {collection.latitude}, {collection.longitude}
        </DataTable.Row>
        <DataTable.Row label="Elevation">{collection.elevation}</DataTable.Row>
        <DataTable.Row label="Depth">{collection.depth}</DataTable.Row>
        <DataTable.Row label="Collected by">{collection.collectedBy}</DataTable.Row>
        <DataTable.Row label="Location generalisation"></DataTable.Row>
        <DataTable.Row label="Permit or ethics code"></DataTable.Row>
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

function Identification({ collection }: { collection: CollectionEvent }) {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Field identification
      </Text>
      <DataTable>
        <DataTable.Row label="Organism name"></DataTable.Row>
        <DataTable.Row label="Identified by">{collection.identifiedBy}</DataTable.Row>
        <DataTable.Row label="Identification date">{collection.identifiedDate?.toString()}</DataTable.Row>
      </DataTable>
    </Stack>
  );
}

function Details({ collection }: { collection: CollectionEvent }) {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Collecting details
      </Text>
      <DataTable>
        <DataTable.Row label="Organism quantity">{collection.organismQuantity}</DataTable.Row>
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
