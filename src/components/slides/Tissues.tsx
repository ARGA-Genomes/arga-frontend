import { Tissue } from "@/generated/types";
import { Group, Paper, SimpleGrid, Stack, Text, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { IconSubsample } from "../ArgaIcons";
import { DataTable } from "../data-table";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { EventDetails, PublicationDetails, SlideNavigation } from "./common";

interface TissueSlideProps {
  tissues: Tissue[];
}

export function TissueSlide({ tissues }: TissueSlideProps) {
  const [tissue, setTissue] = useState(tissues.at(0));

  return (
    <SlideNavigation
      icon={<IconSubsample size={200} />}
      records={tissues}
      selected={tissue}
      onSelected={(record) => setTissue(record)}
      getLabel={(record) => record.tissueId}
    >
      {tissue && (
        <SimpleGrid cols={2} w="100%" mr={80} mb="xl">
          <Stack>
            <EventDetails version="" />
            <TissueDetails tissue={tissue} />
          </Stack>
          <Stack>
            <PublicationDetails publication={tissue.publication} />
            <CollectionDetails tissue={tissue} />
            <ReferenceMaterialStatus tissue={tissue} />
          </Stack>
        </SimpleGrid>
      )}
    </SlideNavigation>
  );
}

function TissueDetails({ tissue }: { tissue: Tissue }) {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Tissue deposition
      </Text>
      <DataTable>
        <DataTable.RowValue label="Tissue number">{tissue.tissueId}</DataTable.RowValue>
        <DataTable.RowValue label="Tissue name"></DataTable.RowValue>
        <DataTable.RowValue label="Institution">{tissue.institution}</DataTable.RowValue>
        <DataTable.RowValue label="Registered by"></DataTable.RowValue>
        <DataTable.RowValue label="Registration date"></DataTable.RowValue>
        <DataTable.RowValue label="Tissue sampling protocol">{tissue.samplingProtocol}</DataTable.RowValue>
        <DataTable.RowValue label="Tissue type">{tissue.tissueType}</DataTable.RowValue>
        <DataTable.RowValue label="Tissue disposition">{tissue.disposition}</DataTable.RowValue>
        <DataTable.RowValue label="Tissue fixation">{tissue.fixation}</DataTable.RowValue>
        <DataTable.RowValue label="Tissue storage">{tissue.storage}</DataTable.RowValue>
        <DataTable.RowValue label="Tissue custodian">{tissue.custodian}</DataTable.RowValue>
      </DataTable>
    </Stack>
  );
}

function CollectionDetails({ tissue }: { tissue: Tissue }) {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Collection
      </Text>
      <DataTable>
        <DataTable.RowValue label="Type strain"></DataTable.RowValue>
        <DataTable.RowValue label="Collection"></DataTable.RowValue>
        <DataTable.RowValue label="Collection type"></DataTable.RowValue>
      </DataTable>
    </Stack>
  );
}

function ReferenceMaterialStatus({ tissue }: { tissue: Tissue }) {
  return (
    <Paper p="lg" ml="auto" shadow="none" radius="xl" bg="moss.1">
      <Text fw={600} fz="sm" c="midnight.7">
        Reference material status
      </Text>

      <Stack pl="xs" pt="md" gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Text fw={600} fz="sm" c="midnight.7">
            Designated reference material
          </Text>
          <DataCheckIcon value={tissue.referenceMaterial} />
        </Group>

        <Group justify="space-between" wrap="nowrap">
          <Text fw={600} fz="sm" c="midnight.7">
            Identification verified
          </Text>
          <DataCheckIcon value={tissue.identificationVerified} />
        </Group>
      </Stack>
    </Paper>
  );
}

function DataCheckIcon({ value }: { value?: number | string | boolean | null | undefined }) {
  const theme = useMantineTheme();
  const size = 35;

  return (
    <Paper radius="xl" p={0} m={0} h={size} w={size}>
      {value ? <IconCircleCheck color={theme.colors.moss[5]} size={size} /> : <IconCircleX color="red" size={size} />}
    </Paper>
  );
}
