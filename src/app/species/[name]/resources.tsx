import {Paper, Text} from '@mantine/core';
import {CommonGenome} from "@/app/type";
import GenomeTable from "@/app/species/[name]/commonGenomeRecordTable";
import React from "react";

export function Resources({ data }: { data : CommonGenome[] }) {

  return (
    <><Text style={{padding: 25}} color="white">All Genome Sequence Records</Text>
      <Paper radius="lg" py={25}>
        <GenomeTable records={data} />
      </Paper>
    </>
  );
}
