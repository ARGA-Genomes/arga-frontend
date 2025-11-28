import { Deposition } from "@/generated/types";
import { Group, Stack } from "@mantine/core";
import { IconDeposition } from "../ArgaIcons";
import { DataTable } from "../data-table";

interface DepositionSlideProps {
  deposition: Deposition;
}

export function DepositionSlide({ deposition }: DepositionSlideProps) {
  return (
    <Stack px="xl">
      <DepositionDetails deposition={deposition} />
    </Stack>
  );
}

function DepositionDetails({ deposition }: { deposition?: Deposition }) {
  return (
    <Stack>
      <DataTable>
        <DataTable.RowValue label="Release date" />
        <DataTable.RowValue label="Publication" />
        <DataTable.RowValue label="Publication DOI" />
        <DataTable.RowValue label="Access" />
        <DataTable.RowValue label="License" />
      </DataTable>
      <Group>
        <IconDeposition size={200} />
      </Group>
    </Stack>
  );
}
