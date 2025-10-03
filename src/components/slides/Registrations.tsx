import { Grid, Group, Paper, Stack, Text } from "@mantine/core";
import { DataTable } from "../data-table";
import { IconSpecimenRegistration } from "../ArgaIcons";
import { Registration } from "@/generated/types";
import { useState } from "react";
import { EventDetails, PublicationDetails, SlideNavigation } from "./common";

interface RegistrationSlideProps {
  registrations: Registration[];
}

export function RegistrationSlide({ registrations }: RegistrationSlideProps) {
  const [registration, setRegistration] = useState(registrations.at(0));

  return (
    <SlideNavigation
      icon={<IconSpecimenRegistration size={200} />}
      records={registrations}
      selected={registration}
      onSelected={(record) => setRegistration(record)}
      getLabel={(record) => record.collectionRepositoryId ?? record.specimenId}
    >
      <Grid w="100%" mr="xl" mb="xl">
        <Grid.Col span={12}>
          <Group grow>
            <EventDetails version="" />
            <PublicationDetails publication={registration?.publication} />
          </Group>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack>
            <Collection registration={registration} />
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack>
            <Associated />
          </Stack>
        </Grid.Col>
        <Grid.Col span={12}>
          <Status />
        </Grid.Col>
      </Grid>
    </SlideNavigation>
  );
}

function Collection({ registration }: { registration?: Registration }) {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Registration in institutional collection
      </Text>
      <DataTable>
        <DataTable.RowValue label="Catalog number">{registration?.collectionRepositoryId}</DataTable.RowValue>
        <DataTable.RowValue label="From field number"></DataTable.RowValue>
        <DataTable.RowValue label="Registered by">{registration?.accessionedBy}</DataTable.RowValue>
        <DataTable.RowValue label="Registration date">{registration?.eventDate}</DataTable.RowValue>
        <DataTable.RowValue label="Institution">{registration?.institutionCode}</DataTable.RowValue>
        <DataTable.RowValue label="Collection">{registration?.collectionRepositoryCode}</DataTable.RowValue>
      </DataTable>
    </Stack>
  );
}

function Associated() {
  return (
    <Paper withBorder shadow="none" p="md" radius="xl">
      <Stack>
        <Text fw={600} fz="sm" c="midnight.9">
          Associated accessions
        </Text>
      </Stack>
    </Paper>
  );
}

function Status({ registration }: { registration?: Registration }) {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Registration status
      </Text>
      <DataTable>
        <DataTable.Row label="Registered as">{registration?.typeStatus}</DataTable.Row>
        <DataTable.Row label="Last identified by">{registration?.identifiedBy}</DataTable.Row>
        <DataTable.Row label="Last identification date">{registration?.identifiedDate}</DataTable.Row>
        <DataTable.Row label="Specimen type">{registration?.preparation}</DataTable.Row>
        <DataTable.Row label="Specimen disposition">{registration?.disposition}</DataTable.Row>
        <DataTable.Row label="Specimen fixation"></DataTable.Row>
        <DataTable.Row label="Specimen storage"></DataTable.Row>
      </DataTable>
    </Stack>
  );
}
