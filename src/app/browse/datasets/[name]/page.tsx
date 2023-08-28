'use client';

import { SpeciesCard } from "@/app/components/species-card";
import { argaBrandLight } from "@/app/theme";
import { gql, useQuery } from "@apollo/client";
import { Box, Paper, SimpleGrid, Text, Pagination, MantineProvider, Title } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { useEffect, useState } from "react";


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
      <SimpleGrid cols={3} pt={40}>
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


export default function BrowseDataset({ params }: { params: { name: string } }) {
  const dataset = decodeURIComponent(params.name).replaceAll("_", " ");

  return (
    <MantineProvider inherit withGlobalStyles withNormalizeCSS theme={argaBrandLight}>
      <Box>
        <Title order={2}>{dataset}</Title>
      </Box>
      <Box>
        <Species dataset={dataset}/>
      </Box>
    </MantineProvider>
  );
}
