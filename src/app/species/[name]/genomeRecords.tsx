import { Table, Text, ScrollArea} from '@mantine/core';
import {GenomicData, QueryResults} from "@/app/type";
import * as Luxon from "luxon";
import Link from "next/link";

interface GenomeSequenceRecordDetails {
  key: string;
  name: string;
  //icon: TablerIcon;
}

const fields: GenomeSequenceRecordDetails[] = [
  {
    key: 'accession',
    name: 'Accession'
  },
  {
    key: 'type',
    name: 'Type'
  },
  {
    key: 'refseqCategory',
    name: 'RefseqCategory',
  },
  {
    key: 'dataResource',
    name: 'DataResource',
  },
  {
    key: 'license',
    name: 'License',
  },
  {
    key: 'provenance',
    name: 'Provenance',
  },
  {
    key: 'eventDate',
    name: 'EventDate',
  },
  {
    key: 'accessionUri',
    name: 'Accession Uri',
  },
]

function GenomeRecordsTable({ data }: { data : GenomicData[] }){
  const rows = data.map((row) => {
    const link = row.accessionUri ?? "";
    return (
      <tr key={row.accession}>
        <td><Text color="white">{row.accession}</Text></td>
        <td><Text color="white">{row.type}</Text></td>
        <td><Text color="white">{row.refseqCategory}</Text></td>
        <td><Text color="white">{row.dataResource}</Text></td>
        <td><Text color="white">{row.license}</Text></td>
        <td><Text color="white">{row.provenance}</Text></td>
        <td><Text color="white">{Luxon.DateTime.fromISO(row.eventDate).toLocaleString()}</Text></td>
        <td><Link href={link}><Text color="white">{row.accessionUri}</Text></Link></td>
      </tr>
    );
  });

  const headers = fields.map(field => {
    let th = <>
      <th><Text color="white">{field.name}</Text></th>
    </>;
    return th;
  })

  return (
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing="xs" withColumnBorders withBorder>
        <thead>
        <tr>{headers}
        </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );

}

export function GenomeRecords({ data }: { data : GenomicData[] }) {

  return (
    <GenomeRecordsTable data={data}/>
  );
}
