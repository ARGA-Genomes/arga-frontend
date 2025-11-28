import { HiC } from "@/generated/types";
import { Stack } from "@mantine/core";
import { DataTable } from "../data-table";

interface HiCSlideProps {
  hiC: HiC;
}

export function HiCSlide({ hiC }: HiCSlideProps) {
  return (
    <Stack px="xl">
      <HiCDetails hiC={hiC} />
    </Stack>
  );
}

function HiCDetails({ hiC }: { hiC?: HiC }) {
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
