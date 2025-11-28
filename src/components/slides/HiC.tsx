import { Stack } from "@mantine/core";
import { DataTable } from "../data-table";

export function HiCSlide() {
  return (
    <Stack px="xl">
      <HiCDetails />
    </Stack>
  );
}

function HiCDetails() {
  return (
    <Stack>
      <DataTable>
        <DataTable.RowValue label="Project accession" />
        <DataTable.RowValue label="Total contact pairs" />
        <DataTable.RowValue label="Assembly" />
        <DataTable.RowValue label="Genome coverage" />
        <DataTable.RowValue label="Sequencing platform" />
      </DataTable>
    </Stack>
  );
}
