'use client';

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import { Paper, Title, Box, Text, Card, SimpleGrid, Group, Button, Divider, Flex, Grid, Stack } from "@mantine/core";
import Link from "next/link";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);


const chartColours = [
  "#3A637C", "#509590", "#7da243", "#da5d0b", "#e4a107"
];


const GET_STATS = gql`
query Stats($family: String) {
  stats {
    family(family: $family) {
			totalGenera
      generaWithData
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

type FamilyStats = {
  totalGenus: number,
  generaWithData: number,
  breakdown: Breakdown[],
};

type Stats = {
  family: FamilyStats,
};

type StatsQueryResults = {
  stats: Stats,
};


const GET_GENERA = gql`
query Genus($family: String) {
  search {
    genus (family: $family) {
      genusName
      totalRecords
    }
  }
}`;


type Record = {
  genusName: string,
  totalRecords: number,
}

type SearchResults = {
  genus: Record[],
};

type QueryResults = {
  search: SearchResults,
};


function RecordItem({ record }: { record: Record }) {
  return (
    <Card shadow="sm" radius="lg" withBorder>
      <Stack>
        <Title order={5}>{record.genusName}</Title>

        <Flex align="center" gap="md">
          <Title size={40} color={record.totalRecords == 0 ? "wheat" : "midnight"} align="center">{record.totalRecords}</Title>
          <Text>species</Text>
        </Flex>
      </Stack>
      <Divider my={20} />
      <Link href={`/genus/${record.genusName}`}>
        <Button color="midnight.5" radius={10}>View genus</Button>
      </Link>
    </Card>
  )
}


function DataCoverage({ stats }: { stats: FamilyStats }) {
  const total = stats.totalGenera;
  const withData = stats.generaWithData;

  const chartData = {
    labels: ['Genera with data', 'Genera without data'],
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

function DataBreakdown({ stats }: { stats: FamilyStats }) {
  const breakdown = Array.from(stats.breakdown).sort((a, b) => a.total > b.total ? -1 : 1);

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


function Statistics({ family }: { family: string }) {
  const { loading, error, data } = useQuery<StatsQueryResults>(GET_STATS, {
    variables: {
      family: family
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
      <Text color="white" c="dimmed">{data.stats.family.totalGenera} genera found</Text>
      <Text color="white" c="dimmed">{data.stats.family.generaWithData} genera with data</Text>

      <Title color="white" order={3} pb={10} pt={20}>Data coverage</Title>
      <Flex>
        <DataCoverage stats={data.stats.family} />
        <DataBreakdown stats={data.stats.family} />
      </Flex>
    </Box>
  )
}


export default function FamilyPage({ params }: { params: { name: string } }) {
  const { loading, error, data } = useQuery<QueryResults>(GET_GENERA, {
    variables: {
      family: params.name
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

  const records = data.search.genus;

  return (
    <Box>
      <Paper bg="midnight.6" p={40} radius={35}>
        <Title order={3} color="white">{Humanize.capitalize(params.name)}</Title>
        <Statistics family={params.name} />
      </Paper>

      <SimpleGrid cols={3} p={40}>
        {records.map(record => (
          <RecordItem key={record.genusName} record={record} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
