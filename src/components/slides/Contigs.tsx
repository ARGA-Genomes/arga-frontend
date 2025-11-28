import { AssemblyDetails } from "@/generated/types";
import { Group, Stack } from "@mantine/core";
import { IconContigs } from "../ArgaIcons";
import { DataTable } from "../data-table";
import { formatBases, formatDate, formatNumber } from "@/helpers/formatters";

interface ContigSlideProps {
  assembly: AssemblyDetails;
}

export function ContigSlide({ assembly }: ContigSlideProps) {
  return (
    <Stack px="xl">
      <ContigDetails assembly={assembly} />
    </Stack>
  );
}

function ContigDetails({ assembly }: { assembly?: AssemblyDetails }) {
  return (
    <Stack>
      <DataTable>
        <DataTable.RowValue label="Assembler used" />
        <DataTable.RowValue label="Assembly date">{formatDate(assembly?.eventDate)}</DataTable.RowValue>
        <DataTable.RowValue label="Input data" />
        <DataTable.RowValue label="Coverage depth" />
        <DataTable.RowValue label="Number of contigs">{formatNumber(assembly?.numberOfContigs)}</DataTable.RowValue>
        <DataTable.RowValue label="Total contig length">{formatBases(assembly?.size)}</DataTable.RowValue>
        <DataTable.RowValue label="Contig N50">{assembly?.assemblyN50}</DataTable.RowValue>
        <DataTable.RowValue label="Contig L50" />
      </DataTable>
      <Group>
        <IconContigs size={200} />
      </Group>
    </Stack>
  );
}
