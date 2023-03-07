'use client';

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import { Paper, Title, Box, Text, Card, SimpleGrid, Group, Button, Divider, Flex } from "@mantine/core";
import Link from "next/link";


const GET_SPECIES = gql`
query Species($genus: String) {
  search {
    filtered2 (genus: $genus) {
      total
      records {
        id
        speciesUuid
        scientificName
        genomicDataRecords

        biome
        class
        eventDate
        eventTime
        family
        genus
        identifiedBy
        kingdom
        license
        phylum
        recordedBy
        species
      }
    }
  }
}`;


type Record = {
  id: string,
  speciesUuid: string,
  scientificName: string,
  genomicDataRecords: number,

  biome: string,
  class: string,
  eventDate: string,
  eventTime: string,
  family: string,
  genus: string,
  identifiedBy: string[]
  kingdom: string,
  license: string,
  phylum: string,
  recordedBy: string,
  species: string,
}

type Results = {
  total: number,
  records: Record[],
}

type SearchResults = {
  filtered2: Results,
};

type QueryResults = {
  search: SearchResults,
};


function RecordItem({ record }: { record: Record }) {
  return (
    <Card shadow="sm" radius="lg" withBorder>
      <Group position="apart">
        <Title order={5}>{record.scientificName}</Title>
        <Text color="white" c="dimmed">
          {record.kingdom}
          , {record.phylum}
          , {record.class}
          {/* , {record.order} */}
          , {record.family}
          , {record.genus}
        </Text>

        <Flex align="center" gap="md">
          <Title size={40} color={record.genomicDataRecords == 0 ? "wheat" : "midnight"} align="center">{record.genomicDataRecords}</Title>
          <Text>data records available</Text>
        </Flex>
      </Group>
      <Divider my={20} />
      <Link href={record.speciesUuid || "#"} target="_blank">
        <Button color="midnight.5" radius={10}>View species</Button>
      </Link>
    </Card>
  )
}


export default function GenusPage({ params }: { params: { name: string } }) {
  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
      genus: params.name
    },
  });

  if (loading) {
    return (<Text>Loading...</Text>);
  }
  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }
  if (!data) {
    return (<Text>No data</Text>);
  }

  const records = data.search.filtered2.records;
  const total = data.search.filtered2.total;

  return (
    <Box>
      <Paper bg="midnight.6" p={40} radius={35}>
        <Title order={3} color="white">{Humanize.capitalize(params.name)}</Title>
        <Text color="white" c="dimmed">{total} species found</Text>
      </Paper>

      <SimpleGrid cols={3} p={40}>
        {records.map(record => (
          <RecordItem key={record.id} record={record} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
