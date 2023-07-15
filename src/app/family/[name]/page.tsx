"use client";

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import {
  Paper,
  Title,
  Box,
  Text,
  Card,
  SimpleGrid,
  Flex,
  Stack,
  LoadingOverlay,
  Grid,
  Image,
  Pagination,
} from "@mantine/core";

import FeatureToggleMenu from "../../components/feature-toggle";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Link from "next/link";
import { CircleCheck, CircleX } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { useScrollIntoView } from "@mantine/hooks";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartColours = [
  "#3A637C",
  "#509590",
  "#7da243",
  "#da5d0b",
  "#e4a107",
  "#7592a3",
  "#85b5b1",
  "#b1c78e",
  "#e99e6d",
  "#efc76a",
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
  name: string;
  total: number;
};

type FamilyStats = {
  totalGenera: number;
  generaWithData: number;
  breakdown: Breakdown[];
};

type Stats = {
  family: FamilyStats;
};

type StatsQueryResults = {
  stats: Stats;
};

const GET_FAMILY_SPECIES = gql`
  query FamilySpecies($family: String, $page: Int) {
    family(family: $family) {
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
  }
`;

type Photo = {
  url: string;
};

type DataSummary = {
  wholeGenomes: number;
  organelles: number;
  barcodes: number;
  other: number;
};

type Record = {
  taxonomy: { canonicalName?: string };
  photo?: Photo;
  dataSummary: DataSummary;
};

type SearchResults = {
  species: {
    records: Record[],
    total: number
  };
};

type QueryResults = {
  family: SearchResults;
};


const GET_FAMILY = gql`
  query Family($family: String) {
    family(family: $family) {
      taxonomy {
        kingdom
        phylum
        class
        order
        family
      }
    }
  }
`;

type Taxonomy = {
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
};

type FamilyResult = {
  family: { taxonomy: Taxonomy };
};

function DataCoverage({ stats }: { stats: FamilyStats }) {
  const total = stats.totalGenera;
  const withData = stats.generaWithData;

  const chartData = {
    labels: ["Genera with data", "Genera without data"],
    datasets: [
      {
        label: "Records",
        data: [withData, total - withData],
        backgroundColor: ["#7da243", "#da5d0b"],
        borderColor: ["rgba(255, 255, 255, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Box h={200}>
      <Pie options={options} data={chartData} />
    </Box>
  );
}

function DataBreakdown({ stats }: { stats: FamilyStats }) {
  const breakdown = Array.from(stats.breakdown).sort((a, b) =>
    a.total > b.total ? -1 : 1
  );

  const chartData = {
    labels: breakdown.map((item) => item.name),
    datasets: [
      {
        label: "Records",
        data: breakdown.map((item) => item.total),
        borderWidth: 1,
        backgroundColor: chartColours,
        borderColor: ["rgba(255, 255, 255, 1)"],
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
        },
      },
    },
  };

  return (
    <Box h={200}>
      <Pie options={options} data={chartData} />
    </Box>
  );
}

function StatCard({ metric, value }: { metric: string; value: number }) {
  return (
    <Card shadow="none" radius="lg" bg="shellfish.0" m={10}>
      <Card.Section p="md">
        <Stack w="100%" spacing={4}>
          <Text size="md" weight={600}>
            {metric}
          </Text>
          <Text size={30} weight={500}>
            {Humanize.compactInteger(value)}
          </Text>
        </Stack>
      </Card.Section>
    </Card>
  );
}

function Statistics({ family }: { family: string }) {
  const { loading, error, data } = useQuery<StatsQueryResults>(GET_STATS, {
    variables: {
      family,
    },
  });

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error : {error.message}</Text>;
  }
  if (!data) {
    return <Text>No data</Text>;
  }

  return (
    <Box>
      <SimpleGrid cols={5}>
        <StatCard
          metric="Genera (valid)"
          value={data.stats.family.totalGenera}
        />
        <StatCard metric="Genera (all)" value={data.stats.family.totalGenera} />

        <StatCard metric="Genomes" value={data.stats.family.generaWithData} />
        <StatCard metric="Genetic markers" value={0} />
        <StatCard metric="Other genomic data" value={0} />
      </SimpleGrid>

      <Title color="white" order={3} pb={10} pt={20}>
        Data coverage
      </Title>
      <Flex>
        <DataCoverage stats={data.stats.family} />
        <DataBreakdown stats={data.stats.family} />
      </Flex>
    </Box>
  );
}

function DataItem({ name, count }: { name: string; count: number }) {
  const hasData = count > 0;
  const dimmed = "rgba(134, 142, 150, .5)";
  const extraDimmed = "rgba(134, 142, 150, .3)";

  return (
    <Grid>
      <Grid.Col span="content" pb={0} pr={0} mr={0}>
        {hasData ? (
          <CircleCheck color="green" />
        ) : (
          <CircleX color={extraDimmed} />
        )}
      </Grid.Col>
      <Grid.Col span="auto">
        <Text c={hasData ? "black" : dimmed} fw={hasData ? 500 : 400}>
          {name}
        </Text>
      </Grid.Col>
      <Grid.Col span="content">
        <Text c={hasData ? "black" : dimmed} fw={hasData ? 500 : 400}>
          {count} records
        </Text>
      </Grid.Col>
    </Grid>
  );
}

function SpeciesCard({ species }: { species: Record }) {
  const itemLinkName = species.taxonomy.canonicalName?.replaceAll(" ", "_");

  function small(photo: Photo) {
    return photo.url.replaceAll("original", "small");
  }

  return (
    <Card shadow="sm" p={20} radius="lg" withBorder>
      <Link href={`/species/${itemLinkName}/summary`}>
        <Title order={4}>{species.taxonomy.canonicalName}</Title>
      </Link>

      <Box py={20}>
        <DataItem name="Genomes" count={species.dataSummary.wholeGenomes} />
        <DataItem name="Genetic Loci*" count={species.dataSummary.barcodes} />
        <DataItem name="Other" count={species.dataSummary.other} />
      </Box>

      <Card.Section>
        <Link href={`/species/${itemLinkName}/summary`}>
          {species.photo ? (
            <Image
              src={small(species.photo)}
              height={160}
              alt={species.taxonomy.canonicalName}
            />
          ) : (
            <Image
              withPlaceholder
              height={160}
              alt={species.taxonomy.canonicalName}
            />
          )}
        </Link>
      </Card.Section>
    </Card>
  );
}

const speciesTotalRecords = (species: Record) => {
  return (
    species.dataSummary.wholeGenomes +
    species.dataSummary.organelles +
    species.dataSummary.barcodes +
    species.dataSummary.other
  );
};

function Species({ family }: { family: string }) {
  const [activePage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { scrollIntoView } = useScrollIntoView<HTMLDivElement>({ offset: 60, duration: 500 });

  const { loading, error, data } = useQuery<QueryResults>(GET_FAMILY_SPECIES, {
    variables: {
      family,
      page: activePage
    },
  });

  useEffect(() => {
    if (data?.family.species.total) {
      setTotalPages(Math.ceil(data.family.species.total / 16))
    }
  }, [data]);


  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error : {error.message}</Text>;
  }
  if (!data) {
    return <Text>No data</Text>;
  }

  const records = Array.from(data.family.species.records);
  const ordered = records.sort(
    (spa, spb) => speciesTotalRecords(spb) - speciesTotalRecords(spa)
  );

  return (
    <Box>
      <SimpleGrid cols={3} pt={40}>
        {ordered.map((record) => (
          <SpeciesCard key={record.taxonomy.canonicalName} species={record} />
        ))}
      </SimpleGrid>

      <Paper bg="midnight.0" p={20} m={40} radius="lg">
        <Pagination
          color="midnight.6"
          size="lg"
          radius="md"
          position="center"
          page={activePage}
          total={totalPages}
          onChange={page => {
            setPage(page)
            scrollIntoView({ alignment: 'center' })
          }}
        />
      </Paper>
    </Box>
  );
}

interface HeaderProps {
  family: string;
}

function Header({ family }: HeaderProps) {
  return (
    <Grid>
      <Grid.Col span="auto">
        <Stack justify="center" h="100%" spacing={0} pt="sm" pb="xl">
          <Title order={3} color="white" size={26}>
            {family}
          </Title>
          <Text color="gray" mt={-8}>
            <b>Classification: </b>Family
          </Text>
        </Stack>
      </Grid.Col>
      <Grid.Col span="content">
        <Stack h="100%" justify="center"></Stack>
      </Grid.Col>
    </Grid>
  );
}

export default function GenusPage({ params }: { params: { name: string } }) {
  const { loading, error, data } = useQuery<FamilyResult>(GET_FAMILY, {
    variables: {
      family: params.name,
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  const taxonomy = data?.family.taxonomy;

  return (
    <Box>
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: "xl", color: "moss.5" }}
        visible={loading}
      />
      {taxonomy && <Header family={taxonomy.family || params.name} />}

      <Box>
        <Paper bg="midnight.6" p={40} radius="lg">
          <Statistics family={params.name} />
        </Paper>

        <Species family={params.name} />

        <FeatureToggleMenu />
      </Box>
    </Box>
  );
}
