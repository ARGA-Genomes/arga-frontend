'use client';

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import { Paper, Title, Box, Text, Card, SimpleGrid, Group, Button, Divider, Flex, Grid } from "@mantine/core";
import Link from "next/link";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);


const chartColours = [
  "#3A637C", "#509590", "#7da243", "#da5d0b", "#e4a107"
];


const GET_STATS = gql`
query Stats($genus: String) {
  stats {
    genus(genus: $genus) {
			totalSpecies
      speciesWithData
      breakdown {
        name
        total
      }
		}
  }
}
`;

type Breakdown = {
  name: string,
  total: number,
};

type GenusStats = {
  totalSpecies: number,
  speciesWithData: number,
  breakdown: Breakdown[],
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


function DataCoverage({ stats }: { stats: GenusStats }) {
  const total = stats.totalSpecies;
  const withData = stats.speciesWithData;

  const chartData = {
    labels: ['Species with data', 'Species without data'],
    datasets: [
      {
        label: 'Records',
        data: [withData, total - withData],
        backgroundColor: [
          '#7da243',
          '#da5d0b',
        ],
        borderColor: [
          'rgba(255, 255, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    }
  }

  return (
    <Box h={200}>
      <Pie options={options} data={chartData} />
    </Box>
  )
}

function DataBreakdown({ stats }: { stats: GenusStats }) {
  const breakdown = stats.breakdown;

  const chartData = {
    labels: breakdown.map(item => item.name),
    datasets: [
      {
        label: 'Records',
        data: breakdown.map(item => item.total),
        borderWidth: 1,
        backgroundColor: chartColours,
        borderColor: [
          'rgba(255, 255, 255, 1)',
        ],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "left" as const,
        labels: {
          color: "white",
        }
      },
    },
  };

  return (
    <Box h={200}>
      <Pie options={options} data={chartData} />
    </Box>
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

  return (
    <Box>
      <Text color="white" c="dimmed">{data.stats.genus.totalSpecies} species found</Text>
      <Text color="white" c="dimmed">{data.stats.genus.speciesWithData} species with data</Text>

      <Title color="white" order={3} pb={10} pt={20}>Data coverage</Title>
      <Flex>
        <DataCoverage stats={data.stats.genus} />
        <DataBreakdown stats={data.stats.genus} />
      </Flex>
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
