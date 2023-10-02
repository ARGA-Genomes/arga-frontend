'use client';

import { SpeciesCard } from "@/components/species-card";
import { PieChart } from "@/components/graphing/pie";
import { gql, useQuery } from "@apollo/client";
import { Box, Paper, SimpleGrid, Text, Title, Group, Stack, Container } from "@mantine/core";
import { useState } from "react";
import { BarChart } from "@/components/graphing/bar";
import { TachoChart } from "@/components/graphing/tacho";
import { PaginationBar } from "@/components/pagination";
import Link from "next/link";
import { MAX_WIDTH } from "@/app/constants";
import { LoadOverlay, LoadPanel } from "@/components/load-overlay";


const PAGE_SIZE = 10;

const GET_DATASET = gql`
query DatasetDetails($name: String) {
  dataset(name: $name) {
    citation
    license
    rightsHolder
    url
    updatedAt
  }
}`;

type Dataset = {
  citation?: string,
  license?: string,
  rightsHolder?: string,
  url?: string,
  updatedAt: string,
};

type DetailsQueryResults = {
  dataset: Dataset,
};


const GET_SPECIES = gql`
query DatasetSpecies($name: String, $page: Int) {
  dataset(name: $name) {
    species(page: $page) {
      total
      records {
        taxonomy {
          canonicalName
        }
        photo {
          url
        }
        dataSummary {
          wholeGenomes
          organelles
          barcodes
          other
        }
      }
    }
  }
}`;

type Photo = {
  url: string,
}

type DataSummary = {
  wholeGenomes: number,
  organelles: number,
  barcodes: number,
  other: number,
}

type Record = {
  taxonomy: { canonicalName: string },
  photo: Photo,
  dataSummary: DataSummary,
}

type DatasetSpecies = {
  species: {
    records: Record[],
    total: number,
  }
};

type SpeciesQueryResults = {
  dataset: DatasetSpecies,
};


const GET_STATS = gql`
  query DatasetStats($name: String) {
    stats {
      dataset(name: $name) {
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
  name: string;
  total: number;
};

type DatasetStats = {
  totalSpecies: number;
  speciesWithData: number;
  breakdown: Breakdown[];
};

type StatsQueryResults = {
  stats: { dataset: DatasetStats };
};


function Species({ dataset }: { dataset: string }) {
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery<SpeciesQueryResults>(GET_SPECIES, {
    variables: { name: dataset, page },
  });

  const records = Array.from(data?.dataset.species.records || []);

  return (
    <>
      <LoadOverlay visible={loading} />

      { error ? <Title order={4}>{error.message}</Title> : null }

      <SimpleGrid cols={5}>
        {records.map((record) => (
          <SpeciesCard key={record.taxonomy.canonicalName} species={record} />
        ))}
      </SimpleGrid>

      <PaginationBar
        total={data?.dataset.species.total}
        page={page}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </>
  );
}


function DataSummary({ dataset }: { dataset: string }) {
  const { loading, error, data } = useQuery<StatsQueryResults>(GET_STATS, {
    variables: { name: dataset }
  });

  const sampleData = [
    { name: "data1", value: 30},
    { name: "data2", value: 78},
    { name: "data3", value: 10},
    { name: "data4", value: 40},
  ];

  const sampleGauge = [
    { name: "bad", color: "#f47625", start: 0, end: 50 },
    { name: "decent", color: "#febb1e", start: 50, end: 75 },
    { name: "great", color: "#97bc5d", start: 75, end: 100 },
  ]

  return (
    <Box p={40}>
      <Group>
        <TachoChart w={400} h={250} thresholds={sampleGauge} value={12} />
        <TachoChart w={400} h={250} thresholds={sampleGauge} value={68} />
        <TachoChart w={400} h={250} thresholds={sampleGauge} value={94} />
      </Group>
      <BarChart w={500} h={200} data={sampleData} spacing={0.1} />
      <Group>
        <PieChart w={500} h={300} data={sampleData} labelled />
        <PieChart w={500} h={300} data={sampleData} />
      </Group>
    </Box>
  )
}


function DatasetDetails({ dataset }: { dataset: string }) {
  const { loading, error, data } = useQuery<DetailsQueryResults>(GET_DATASET, {
    variables: { name: dataset }
  });

  return (
    <>
      <LoadOverlay visible={loading} />

      { error ? <Text>{error.message}</Text> : null }
      { data?.dataset.url &&
        <Text fw={700} c="dimmed" size="sm">
          Source: <Link href={data?.dataset.url} target="_blank">ALA Profiles</Link>
        </Text>
      }
      <Text c="dimmed" size="xs">{data?.dataset.citation}</Text>
      <Text c="dimmed" size="xs">&copy; {data?.dataset.rightsHolder}</Text>
    </>
  )
}


export default function BrowseDataset({ params }: { params: { name: string } }) {
  const dataset = decodeURIComponent(params.name).replaceAll("_", " ");

  return (
    <Stack mt="xl">
      <Paper py={20} pos="relative">
        <Container maw={MAX_WIDTH}>
          <Title order={2}>{dataset}</Title>
          <DatasetDetails dataset={dataset} />
        </Container>
      </Paper>

      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Stack>
            <Paper p="xl" radius="lg" withBorder>
              <Title order={3} mb={10}>Data summary</Title>
              <DataSummary dataset={dataset} />
            </Paper>

            <Paper p="xl" radius="lg" withBorder>
              <Title order={3} mb={10}>Browse species</Title>
              <Species dataset={dataset} />
            </Paper>
          </Stack>
        </Container>
      </Paper>
    </Stack>
  );
}
