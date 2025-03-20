"use client";

import { SpeciesCard } from "@/components/species-card";
import { PieChart } from "@/components/graphing/pie";
import { gql, useQuery } from "@apollo/client";
import { Box, Paper, SimpleGrid, Text, Title, Group, Stack, Container } from "@mantine/core";
import { useEffect, useState, use } from "react";
import { BarChart } from "@/components/graphing/bar";
import { TachoChart } from "@/components/graphing/tacho";
import { PaginationBar } from "@/components/pagination";
import Link from "next/link";
import { MAX_WIDTH } from "@/app/constants";
import { LoadOverlay } from "@/components/load-overlay";
import { usePreviousPage } from "@/components/navigation-history";
import { Photo } from "@/app/type";

const PAGE_SIZE = 10;

const GET_DATASET = gql`
  query DatasetDetails($name: String) {
    dataset(by: { name: $name }) {
      citation
      license
      rightsHolder
      url
      updatedAt
    }
  }
`;

interface Dataset {
  citation?: string;
  license?: string;
  rightsHolder?: string;
  url?: string;
  updatedAt: string;
}

interface DetailsQueryResults {
  dataset: Dataset;
}

const GET_SPECIES = gql`
  query DatasetSpecies($name: String, $page: Int) {
    dataset(by: { name: $name }) {
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
            genomes
            loci
            specimens
            other
          }
        }
      }
    }
  }
`;

interface DataSummary {
  genomes: number;
  loci: number;
  specimens: number;
  other: number;
}

interface Record {
  taxonomy: { canonicalName: string };
  photo: Photo;
  dataSummary: DataSummary;
}

interface DatasetSpecies {
  species: {
    records: Record[];
    total: number;
  };
}

interface SpeciesQueryResults {
  dataset: DatasetSpecies;
}

function Species({ dataset }: { dataset: string }) {
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery<SpeciesQueryResults>(GET_SPECIES, {
    variables: { name: dataset, page },
  });

  const records = Array.from(data?.dataset.species.records || []);

  return (
    <>
      <LoadOverlay visible={loading} />

      {error ? <Title order={4}>{error.message}</Title> : null}

      <SimpleGrid cols={5}>
        {records.map((record) => (
          <SpeciesCard key={record.taxonomy.canonicalName} species={record} />
        ))}
      </SimpleGrid>

      <PaginationBar total={data?.dataset.species.total} page={page} pageSize={PAGE_SIZE} onChange={setPage} />
    </>
  );
}

function DataSummary() {
  const sampleData = [
    { name: "data1", value: 30 },
    { name: "data2", value: 78 },
    { name: "data3", value: 10 },
    { name: "data4", value: 40 },
  ];

  const sampleGauge = [
    { name: "bad", color: "#f47625", start: 0, end: 25 },
    { name: "decent", color: "#febb1e", start: 25, end: 75 },
    { name: "great", color: "#97bc5d", start: 75, end: 100 },
  ];

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
  );
}

function DatasetDetails({ dataset }: { dataset: string }) {
  const { loading, error, data } = useQuery<DetailsQueryResults>(GET_DATASET, {
    variables: { name: dataset },
  });

  return (
    <Stack gap={0}>
      <LoadOverlay visible={loading} />

      {error ? <Text>{error.message}</Text> : null}
      {data?.dataset.url && (
        <Text fw={700} c="dimmed" size="sm">
          Source:{" "}
          <Link href={data.dataset.url} target="_blank">
            ALA Profiles
          </Link>
        </Text>
      )}
      <Text c="dimmed" size="xs">
        {data?.dataset.citation}
      </Text>
      <Text c="dimmed" size="xs">
        &copy; {data?.dataset.rightsHolder}
      </Text>
    </Stack>
  );
}

export default function BrowseDataset(props: { params: Promise<{ name: string }> }) {
  const params = use(props.params);
  const dataset = decodeURIComponent(params.name).replaceAll("_", " ");

  const [_, setPreviousPage] = usePreviousPage();

  useEffect(() => {
    setPreviousPage({
      name: `browsing ${dataset}`,
      url: "/browse/datasets/${params.name}",
    });
  });

  return (
    <Stack mt="xl">
      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Group gap={40}>
            <Text c="dimmed" fw={400}>
              DATASET
            </Text>
            <Stack gap={0}>
              <Text fz={38} fw={700}>
                {dataset}
              </Text>
              <DatasetDetails dataset={dataset} />
            </Stack>
          </Group>
        </Container>
      </Paper>

      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Stack>
            <Paper p="xl" radius="lg" withBorder>
              <Title order={5}>Browse species</Title>
              <Species dataset={dataset} />
            </Paper>
          </Stack>
        </Container>
      </Paper>
    </Stack>
  );
}
