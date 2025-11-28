import { Scaffold } from "@/generated/types";
import { Group, Stack } from "@mantine/core";
import { IconScaffolds } from "../ArgaIcons";
import { DataTable } from "../data-table";

interface ScaffoldSlideProps {
  scaffold: Scaffold;
}

export function ScaffoldSlide({ scaffold }: ScaffoldSlideProps) {
  return (
    <Stack px="xl">
      <ScaffoldDetails scaffold={scaffold} />
    </Stack>
  );
}

function ScaffoldDetails({ scaffold }: { scaffold?: Scaffold }) {
  return (
    <Stack>
      <DataTable>
        <DataTable.RowValue label="Scaffold used" />
        <DataTable.RowValue label="Assembly date" />
        <DataTable.RowValue label="Scaffolding methods used" />
        <DataTable.RowValue label="Number of contigs" />
        <DataTable.RowValue label="Longest scaffold" />
        <DataTable.RowValue label="Scaffold N50" />
        <DataTable.RowValue label="Scaffold L50" />
      </DataTable>
      <Group>
        <IconScaffolds size={200} />
      </Group>
    </Stack>
  );
}
