import { Contig } from "@/generated/types";
import { Group, Stack } from "@mantine/core";
import { IconContigs } from "../ArgaIcons";
import { DataTable } from "../data-table";

interface ContigSlideProps {
  contig: Contig;
}

export function ContigSlide({ contig }: ContigSlideProps) {
  return (
    <Stack px="xl">
      <ContigDetails contig={contig} />
    </Stack>
  );
}

function ContigDetails({ contig }: { contig?: Contig }) {
  return (
    <Stack>
      <DataTable>
        <DataTable.RowValue label="Assembler used" />
        <DataTable.RowValue label="Assembly date" />
        <DataTable.RowValue label="Input data" />
        <DataTable.RowValue label="Coverage depth" />
        <DataTable.RowValue label="Number of contigs" />
        <DataTable.RowValue label="Total contig length" />
        <DataTable.RowValue label="Contig N50" />
        <DataTable.RowValue label="Contig L50" />
      </DataTable>
      <Group>
        <IconContigs size={200} />
      </Group>
    </Stack>
  );
}
