import { Group, Stack } from "@mantine/core";
import { IconChromosomes } from "../ArgaIcons";
import { DataTable } from "../data-table";

export function ChromosomeSlide() {
  return (
    <Stack px="xl">
      <ChromosomeDetails />
    </Stack>
  );
}

function ChromosomeDetails() {
  return (
    <Stack>
      <DataTable>
        <DataTable.RowValue label="Number of chromosomes" />
        <DataTable.RowValue label="Chromosome assignment method" />
        <DataTable.RowValue label="Coverage assigned to chromosomes" />
        <DataTable.RowValue label="Number of unplaced scaffolds" />
        <DataTable.RowValue label="Gaps and Ns summary" />
        <DataTable.RowValue label="Naming convention" />
      </DataTable>
      <Group>
        <IconChromosomes size={200} />
      </Group>
    </Stack>
  );
}
