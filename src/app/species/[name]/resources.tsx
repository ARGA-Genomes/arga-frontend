import { Table, Text, ScrollArea} from '@mantine/core';
import {QueryResults} from "@/app/type";
import * as Luxon from "luxon";

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
  }
]

function GenomeRecords({ data }: { data : QueryResults }){
  const rows = data.species.data.map((row) => {
    return (
      <tr key={row.accession}>
        <td><Text color="white">{row.accession}</Text></td>
        <td><Text color="white">{row.type}</Text></td>
        <td><Text color="white">{row.refseqCategory}</Text></td>
        <td><Text color="white">{row.dataResource}</Text></td>
        <td><Text color="white">{row.license}</Text></td>
        <td><Text color="white">{row.provenance}</Text></td>
        <td><Text color="white">{Luxon.DateTime.fromISO(row.eventDate).toLocaleString()}</Text></td>
        <td><Text color="white">{row.accessionUri}</Text></td>
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
      <Text style={{ padding: 25 }} color="white">Genome Sequence Records</Text>
      <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
        <thead>
        <tr>{headers}
        </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );

}

export function Resources({ data }: { data : QueryResults }) {

  return (
    <GenomeRecords data={data}/>
  );
}
