import { Registration, Collection, Organism } from "@/generated/types";
import { SimpleGrid, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { IconSpecimenCollection } from "../ArgaIcons";
import { DataTable } from "../data-table";
import { EventDetails, PublicationDetails, SlideNavigation } from "./common";

interface CollectingSlideProps {
  organism: Organism;
  collections: Collection[];
  registrations: Registration[];
}

export function CollectingSlide({ organism, collections }: CollectingSlideProps) {
  const [collection, setCollection] = useState(collections[0]);

  return (
    <SlideNavigation
      icon={<IconSpecimenCollection size={200} />}
      records={collections}
      selected={collection}
      onSelected={(record) => setCollection(record)}
      getLabel={(record) => record.eventDate ?? "No date"}
    >
      <SimpleGrid cols={2} w="100%" mr={80} mb="xl">
        <Stack>
          <EventDetails version="" />
          <Collecting collection={collection} />
          <Location collection={collection} />
        </Stack>
        <Stack>
          <PublicationDetails publication={collection.publication} />
          <Identification collection={collection} />
          <Details organism={organism} collection={collection} />
        </Stack>
      </SimpleGrid>
    </SlideNavigation>
  );
}

function Collecting({ collection }: { collection: Collection }) {
  return (
    <Stack gap={5}>
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

function Location({ collection }: { collection: Collection }) {
  return (
    <Stack gap={5}>
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

function Identification({ collection }: { collection: Collection }) {
  return (
    <Stack gap={5}>
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

function Details({ organism, collection }: { organism: Organism; collection: Collection }) {
  return (
    <Stack gap={5}>
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
