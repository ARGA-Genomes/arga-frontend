'use client';

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import { Paper, Title, Box, Text, Card, SimpleGrid, Group, Button, Divider, Flex, Container } from "@mantine/core";
import Link from "next/link";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);


const GET_STATS = gql`
query Stats($genus: String) {
  stats {
    genus(genus: $genus) {
			totalSpecies
      speciesWithData
		}
  }
}
`;

type GenusStats = {
  totalSpecies: number,
  speciesWithData: number,
};

type Stats = {
  genus: GenusStats,
};

type StatsQueryResults = {
  stats: Stats,
};


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


function Statistics({ genus }: { genus: string }) {
  const { loading, error, data } = useQuery<StatsQueryResults>(GET_STATS, {
    variables: {
      genus: genus
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

  const total = data.stats.genus.totalSpecies;
  const withData = data.stats.genus.speciesWithData;

  const chartData = {
    labels: ['Species with data', 'Species without data'],
    datasets: [
      {
        label: 'Visits',
        data: [withData, total - withData],
        backgroundColor: [
          '#7da243',
          '#da5d0b',
        ],
        borderColor: [
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      }
    }
  }

  return (
    <Box>
      <Text color="white" c="dimmed">{total} species found</Text>
      <Text color="white" c="dimmed">{withData} species with data</Text>

      <Box maw={200} pt={20} pb={10}>
        <Title color="white" order={3} pb={10}>Data coverage</Title>
        <Pie options={options} data={chartData} />
      </Box>
    </Box>
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

  return (
    <Box>
      <Paper bg="midnight.6" p={40} radius={35}>
        <Title order={3} color="white">{Humanize.capitalize(params.name)}</Title>
        <Statistics genus={params.name} />
      </Paper>

      <SimpleGrid cols={3} p={40}>
        {records.map(record => (
          <RecordItem key={record.id} record={record} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
