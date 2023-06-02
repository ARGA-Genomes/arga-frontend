import { Text } from '@mantine/core';
import {GenomicData} from "@/app/type";
import {GenomeRecords} from "@/app/species/[name]/genomeRecords";

export function Resources({ data }: { data : GenomicData[] }) {

  return (
    <><Text style={{padding: 25}} color="white">Genome Sequence Records</Text><GenomeRecords data={data} expandable={false}/></>
  );
}
