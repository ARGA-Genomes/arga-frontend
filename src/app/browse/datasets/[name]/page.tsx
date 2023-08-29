'use client';

import { SpeciesCard } from "@/app/components/species-card";
import { PieChart } from "@/app/components/graphing/pie";
import { argaBrandLight } from "@/app/theme";
import { gql, useQuery } from "@apollo/client";
import { Box, Paper, SimpleGrid, Text, Pagination, MantineProvider, Title } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { BarChart } from "@/app/components/graphing/bar";


const GET_DATASET_SPECIES = gql`
query DatasetSpecies($name: String, $page: Int) {
  datasets(name: $name) {
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

type SearchResults = {
  species: {
    records: Record[],
    total: number,
  }
};

type QueryResults = {
  datasets: SearchResults,
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
  const [activePage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { scrollIntoView } = useScrollIntoView<HTMLDivElement>({ offset: 60, duration: 500 });

  const { loading, error, data } = useQuery<QueryResults>(GET_DATASET_SPECIES, {
    variables: {
      name: dataset,
      page: activePage,
    },
  });

  useEffect(() => {
    if (data?.datasets.species.total) {
      setTotalPages(Math.ceil(data.datasets.species.total / 16))
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

  const records = Array.from(data.datasets.species.records);

  return (
    <Box>
      <SimpleGrid cols={3}>
        {records.map((record) => (
          <SpeciesCard key={record.taxonomy.canonicalName} species={record} />
        ))}
      </SimpleGrid>

      <Paper bg="midnight.0" p={20} m={40} radius="lg">
        <Pagination
          color={"attribute.2"}
          size="lg"
          radius="xl"
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


function DataSummary({ dataset }: { dataset: string }) {
  const { loading, error, data } = useQuery<StatsQueryResults>(GET_STATS, {
    variables: {
      name: dataset,
    },
  });

  const sampleData = [
    { name: "data1", value: 30},
    { name: "data2", value: 78},
    { name: "data3", value: 10},
    { name: "data4", value: 40},
  ];

  return (
    <Box p={40}>
      <BarChart w={500} h={250} data={sampleData} spacing={0.1} />
      <PieChart w={500} h={300} data={sampleData} labelled />
      <PieChart w={500} h={300} data={sampleData} />
    </Box>
  )
}


export default function BrowseDataset({ params }: { params: { name: string } }) {
  const dataset = decodeURIComponent(params.name).replaceAll("_", " ");

  return (
    <MantineProvider inherit withGlobalStyles withNormalizeCSS theme={argaBrandLight}>
      <Box>
        <Title order={2}>{dataset}</Title>
      </Box>

      <Box mt={30}>
        <Title order={3} mb={10}>Data summary</Title>
        <Paper radius="lg">
          <DataSummary dataset={dataset} />
        </Paper>
      </Box>

      <Box mt={30}>
        <Title order={3} mb={10}>Browse species</Title>
        <Species dataset={dataset}/>
      </Box>
    </MantineProvider>
  );
}
