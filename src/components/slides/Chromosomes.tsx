import { Chromosomes } from "@/generated/types";
import { Group, Stack } from "@mantine/core";
import { IconChromosomes } from "../ArgaIcons";
import { DataTable } from "../data-table";

interface ChromosomeSlideProps {
  chromosome: Chromosomes;
}

export function ChromosomeSlide({ chromosome }: ChromosomeSlideProps) {
  return (
    <Stack px="xl">
      <ChromosomeDetails chromosome={chromosome} />
    </Stack>
  );
}

function ChromosomeDetails({ chromosome }: { chromosome?: Chromosome }) {
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
