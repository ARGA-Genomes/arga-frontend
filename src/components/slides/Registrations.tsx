import { Divider, Grid, Group, Paper, Stack, Text } from "@mantine/core";
import { DataTable } from "../data-table";
import { IconSpecimenRegistration } from "../ArgaIcons";

export function RegistrationsSlide() {
  return (
    <Group wrap="nowrap">
      <Stack justify="space-between" align="center" h="100%">
        <DataTable>
          <DataTable.Row label="Catalog number"></DataTable.Row>
        </DataTable>
        <IconSpecimenRegistration size={200} />
      </Stack>
      <Divider orientation="vertical" mx="md" />

      <Grid w="100%">
        <Grid.Col span={6}>
          <Stack>
            <EventDetails />
            <Collection />
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack>
            <Publication />
            <Associated />
          </Stack>
        </Grid.Col>
        <Grid.Col span={12}>
          <Status />
        </Grid.Col>
      </Grid>
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
