import { AssemblyDetails } from "@/generated/types";
import { Divider, Group, Stack, Text } from "@mantine/core";
import { IconDeposition } from "../ArgaIcons";
import { DataTable } from "../data-table";
import { formatDate } from "@/helpers/formatters";

interface DepositionSlideProps {
  assembly: AssemblyDetails;
}

export function DepositionSlide({ assembly }: DepositionSlideProps) {
  return (
    <Stack px="xl">
      <DepositionDetails assembly={assembly} />
    </Stack>
  );
}

function DepositionDetails({ assembly }: { assembly?: AssemblyDetails }) {
  return (
    <Stack>
      <DataTable>
        <DataTable.RowValue label="Release date">{formatDate(assembly?.eventDate)}</DataTable.RowValue>
        <DataTable.RowValue label="Publication" />
        <DataTable.RowValue label="Publication DOI" />
        <DataTable.RowValue label="Access" />
        <DataTable.RowValue label="License" />
      </DataTable>
      <Divider size="sm" color="shellfishBg.1" />
      <Group justify="space-between">
        <Stack gap={0}>
          <Text fz="xs" fw={650} c="midnight.7">
            Data generators
          </Text>
          <Text fz="xs" fw={450} c="midnight.7" pb="sm" pl="sm">
            no data
          </Text>

          <Text fz="xs" fw={650} c="midnight.7">
            Assembled by
          </Text>
          <Text fz="xs" fw={450} c="midnight.7" pb="sm" pl="sm">
            no data
          </Text>

          <Text fz="xs" fw={650} c="midnight.7">
            Annotated by
          </Text>
          <Text fz="xs" fw={450} c="midnight.7" pb="sm" pl="sm">
            no data
          </Text>

          <Text fz="xs" fw={650} c="midnight.7">
            Deposited by
          </Text>
          <Text fz="xs" fw={450} c="midnight.7" pb="sm" pl="sm">
            no data
          </Text>

          <Text fz="xs" fw={650} c="midnight.7">
            Deposited as
          </Text>
          <Text fz="xs" fw={450} c="midnight.7" pb="sm" pl="sm">
            no data
          </Text>
        </Stack>
        <Stack gap={0} justify="space-between">
          <Text fz="xs" fw={650} c="midnight.7">
            Funding
          </Text>
          <Text fz="xs" fw={450} c="midnight.7" pb="sm" pl="sm">
            no data
          </Text>

          <IconDeposition size={200} />
        </Stack>
      </Group>
    </Stack>
  );
}
