import classes from "./Slide.module.css";

import { AccessionEvent, CollectionEvent, Organism } from "@/generated/types";
import { Box, Divider, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { IconSpecimenCollection } from "../ArgaIcons";
import { DataTable } from "../data-table";

interface CollectingSlideProps {
  organism: Organism;
  collections: CollectionEvent[];
  accessions: AccessionEvent[];
}

export function CollectingSlide({ organism, collections }: CollectingSlideProps) {
  const [collection, setCollection] = useState(collections[0]);
  const navWidth = 260;

  return (
    <Group wrap="nowrap" align="flex-start">
      <Box w={0} style={{ alignSelf: "flex-end", position: "relative" }}>
        <Box p={20}>
          <IconSpecimenCollection size={200} />
        </Box>
      </Box>

      <Stack w={navWidth} mb={240} mt="md" gap={0}>
        {collections.map((event) => (
          <Paper
            key={event.entityId}
            radius="xl"
            my={5}
            p="xs"
            shadow="none"
            bg={event === collection ? "midnight.1" : undefined}
            className={classes.item}
            onClick={() => setCollection(event)}
          >
            <Group wrap="nowrap">
              <Text fz="xs" fw={300} c="midnight.7">
                Event date
              </Text>
              <Text fz="xs" fw={600} c="midnight.7" truncate="start">
                {event.eventDate?.toString() ?? "No date"}
              </Text>
            </Group>
          </Paper>
        ))}
      </Stack>

      <Divider orientation="vertical" mx="md" mb="md" size="sm" color="shellfishBg.1" />

      <SimpleGrid cols={2} w="100%" mr={80} mb="xl">
        <Stack>
          <EventDetails collection={collection} />
          <Collecting collection={collection} />
          <Location collection={collection} />
        </Stack>
        <Stack>
          <Publication />
          <Identification collection={collection} />
          <Details organism={organism} collection={collection} />
        </Stack>
      </SimpleGrid>
    </Group>
  );
}

function EventDetails({ collection }: { collection: CollectionEvent }) {
  return (
    <Paper radius="xl" bg="midnight.0" py="sm" px="xl" shadow="none" mr="auto">
      <DataTable>
        <DataTable.RowValue label="ARGA event ID">{collection.entityId}</DataTable.RowValue>
        <DataTable.RowValue label="Event date">{collection.eventDate?.toString() ?? "No date"}</DataTable.RowValue>
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
        <DataTable.RowValue label="Field number">{collection.fieldCollectingId}</DataTable.RowValue>
        <DataTable.RowValue label="Registered as"></DataTable.RowValue>
        <DataTable.RowValue label="Field habitat">{collection.habitat}</DataTable.RowValue>
        <DataTable.RowValue label="Collecting protocol"></DataTable.RowValue>
        <DataTable.RowValue label="Sample size"></DataTable.RowValue>
        <DataTable.RowValue label="Field notes">{collection.fieldNotes}</DataTable.RowValue>
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
        <DataTable.RowValue label="Exact location">{collection.locality}</DataTable.RowValue>
        <DataTable.RowValue label="Coordinates">
          {collection.latitude}, {collection.longitude}
        </DataTable.RowValue>
        <DataTable.RowValue label="Location generalisation"></DataTable.RowValue>
        <DataTable.RowValue label="Elevation (m)">{collection.elevation}</DataTable.RowValue>
        <DataTable.RowValue label="Depth (m)">{collection.depth}</DataTable.RowValue>
        <DataTable.RowValue label="Collected by">{collection.collectedBy}</DataTable.RowValue>
        <DataTable.RowValue label="Permit or ethics code"></DataTable.RowValue>
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
        <DataTable.RowValue label="Organism name"></DataTable.RowValue>
        <DataTable.RowValue label="Identified by">{collection.identifiedBy}</DataTable.RowValue>
        <DataTable.RowValue label="Identification date">{collection.identifiedDate?.toString()}</DataTable.RowValue>
      </DataTable>
    </Stack>
  );
}

function Details({ organism, collection }: { organism: Organism; collection: CollectionEvent }) {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Collecting details
      </Text>
      <DataTable>
        <DataTable.RowValue label="Organism quantity">{collection.organismQuantity}</DataTable.RowValue>
        <DataTable.RowValue label="Sex">{organism.sex}</DataTable.RowValue>
        <DataTable.RowValue label="Life stage">{organism.lifeStage}</DataTable.RowValue>
        <DataTable.RowValue label="Reproductive condition">{organism.reproductiveCondition}</DataTable.RowValue>
        <DataTable.RowValue label="Organism life status"></DataTable.RowValue>
        <DataTable.RowValue label="Establishment"></DataTable.RowValue>
        <DataTable.RowValue label="Host organism"></DataTable.RowValue>
        <DataTable.RowValue label="Field sample disposition"></DataTable.RowValue>
        <DataTable.RowValue label="Collecting life status"></DataTable.RowValue>
        <DataTable.RowValue label="Collecting kill method"></DataTable.RowValue>
      </DataTable>
    </Stack>
  );
}
