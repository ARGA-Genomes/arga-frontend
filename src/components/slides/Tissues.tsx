import classes from "./Slide.module.css";

import { Tissue } from "@/generated/types";
import { Box, Divider, Group, Paper, SimpleGrid, Stack, Text, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { IconSubsample } from "../ArgaIcons";
import { DataTable } from "../data-table";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";

interface TissueSlideProps {
  tissues: Tissue[];
}

export function TissueSlide({ tissues }: TissueSlideProps) {
  const [tissue, setTissue] = useState(tissues.at(0));
  const navWidth = 260;

  return (
    <Group wrap="nowrap" align="flex-start">
      <Box w={0} style={{ alignSelf: "flex-end", position: "relative" }}>
        <Box p={20}>
          <IconSubsample size={200} />
        </Box>
      </Box>

      <Stack w={navWidth} mb={240} mt="md" gap={0}>
        {tissues.map((record) => (
          <Paper
            maw={navWidth}
            key={record.entityId}
            radius="xl"
            shadow="none"
            my={5}
            p="xs"
            bg={record === tissue ? "midnight.1" : undefined}
            className={classes.item}
            onClick={() => setTissue(record)}
          >
            <Group wrap="nowrap">
              <Text fz="xs" fw={300} c="midnight.7">
                Tissue ID
              </Text>
              <Text fz="xs" fw={600} c="midnight.7" truncate="start">
                {record.tissueId}
              </Text>
            </Group>
          </Paper>
        ))}
      </Stack>

      <Divider orientation="vertical" mx="md" mb="md" size="sm" color="shellfishBg.1" />

      {tissue && (
        <SimpleGrid cols={2} w="100%" mr={80} mb="xl">
          <Stack>
            <EventDetails tissue={tissue} />
            <TissueDetails tissue={tissue} />
          </Stack>
          <Stack>
            <Publication />
            <CollectionDetails tissue={tissue} />
            <ReferenceMaterialStatus tissue={tissue} />
          </Stack>
        </SimpleGrid>
      )}
    </Group>
  );
}

function EventDetails({ tissue }: { tissue: Tissue }) {
  return (
    <Paper radius="xl" bg="midnight.0" py="sm" px="xl" shadow="none" mr="auto">
      <DataTable>
        <DataTable.RowValue label="ARGA event ID">{tissue.tissueId}</DataTable.RowValue>
        <DataTable.RowValue label="Event date"></DataTable.RowValue>
      </DataTable>
    </Paper>
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
