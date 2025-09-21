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
      getLabel={(record) => record.specimenId}
    >
      {registration && (
        <Grid w="100%" mr="xl" mb="xl">
          <Grid.Col span={12}>
            <Group grow>
              <EventDetails version="" />
              <PublicationDetails publication={registration.publication} />
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Stack>
              <Collection />
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
      )}
    </SlideNavigation>
  );
}

function Collection() {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Registration in institutional collection
      </Text>
      <DataTable>
        <DataTable.Row label="Catalog number"></DataTable.Row>
        <DataTable.Row label="From field number"></DataTable.Row>
        <DataTable.Row label="Registered by"></DataTable.Row>
        <DataTable.Row label="Registration date"></DataTable.Row>
        <DataTable.Row label="Institution"></DataTable.Row>
        <DataTable.Row label="Collection"></DataTable.Row>
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

function Status() {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Registration status
      </Text>
      <DataTable>
        <DataTable.Row label="Registered as"></DataTable.Row>
        <DataTable.Row label="Last identified by"></DataTable.Row>
        <DataTable.Row label="Last identification date"></DataTable.Row>
        <DataTable.Row label="Specimen type"></DataTable.Row>
        <DataTable.Row label="Specimen disposition"></DataTable.Row>
        <DataTable.Row label="Specimen storage"></DataTable.Row>
      </DataTable>
    </Stack>
  );
}
