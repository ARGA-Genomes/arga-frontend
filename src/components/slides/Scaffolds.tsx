import { AssemblyDetails } from "@/generated/types";
import { Group, Stack } from "@mantine/core";
import { IconScaffolds } from "../ArgaIcons";
import { DataTable } from "../data-table";
import { formatBases, formatDate, formatNumber } from "@/helpers/formatters";

interface ScaffoldSlideProps {
  assembly: AssemblyDetails;
}

export function ScaffoldSlide({ assembly }: ScaffoldSlideProps) {
  return (
    <Stack px="xl">
      <ScaffoldDetails assembly={assembly} />
    </Stack>
  );
}

function ScaffoldDetails({ assembly }: { assembly?: AssemblyDetails }) {
  return (
    <Stack>
      <DataTable>
        <DataTable.RowValue label="Scaffold used" />
        <DataTable.RowValue label="Assembly date">{formatDate(assembly?.eventDate)}</DataTable.RowValue>
        <DataTable.RowValue label="Scaffolding methods used">{assembly?.method}</DataTable.RowValue>
        <DataTable.RowValue label="Number of contigs">{formatNumber(assembly?.numberOfContigs)}</DataTable.RowValue>
        <DataTable.RowValue label="Longest scaffold">{formatBases(assembly?.longestScaffold)}</DataTable.RowValue>
        <DataTable.RowValue label="Scaffold N50">{formatBases(assembly?.scaffoldN50)}</DataTable.RowValue>
        <DataTable.RowValue label="Scaffold L50">{formatBases(assembly?.scaffoldL50)}</DataTable.RowValue>
      </DataTable>
      <Group>
        <IconScaffolds size={200} />
      </Group>
    </Stack>
  );
}
