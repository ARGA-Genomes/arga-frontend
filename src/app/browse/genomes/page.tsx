'use client';

import { PaginationBar } from "@/app/components/pagination";
import { SpeciesCard } from "@/app/components/species-card";
import { gql, useQuery } from "@apollo/client";
import { Box, LoadingOverlay, SimpleGrid, Title, useMantineTheme } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { useState } from "react";


const PAGE_SIZE = 15;

const GET_SPECIES = gql`
query SpeciesWithAssemblies($page: Int, $perPage: Int) {
  assemblies {
    species(page: $page, perPage: $perPage) {
      total
      records {
        taxonomy {
          canonicalName
        }
        photo {
          url
        }
        dataSummary {
          barcodes
          other
          partialGenomes
          wholeGenomes
        }
      }
    }
  }
}`;

type DataSummary = {
  wholeGenomes: number,
  organelles: number,
  barcodes: number,
  other: number,
}

type Species = {
  taxonomy: { canonicalName: string },
  photo: { url: string },
  dataSummary: DataSummary,
}

type Assemblies = {
  species: {
    records: Species[],
    total: number,
  },
};

type QueryResults = {
  assemblies: Assemblies,
};


function BrowseResults({ list }: { list: Species[]}) {
  if (list.length === 0) return <Title>No data found</Title>

  return (
    <SimpleGrid cols={4}>
      { list.map(item => (<SpeciesCard species={item} key={item.taxonomy.canonicalName} />)) }
    </SimpleGrid>
  )
}


export default function GenomesList() {
  const theme = useMantineTheme();
  const [page, setPage] = useState(1);
  const { scrollIntoView } = useScrollIntoView<HTMLDivElement>({ offset: 60, duration: 500 });

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: { page, perPage: PAGE_SIZE }
  });

  return (
    <Box>
      <Box mt={20}>
        <LoadingOverlay
          overlayColor={theme.colors.midnight[0]}
          transitionDuration={500}
          loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
          visible={loading}
          radius="xl"
        />

        <Title order={2} mb={20}>Genomes</Title>

        { error ? <Title order={4}>{error.message}</Title> : null }
        { !loading && data ? <BrowseResults list={data.assemblies.species.records} /> : null }

        <PaginationBar
          total={data?.assemblies.species.total}
          page={page}
          pageSize={PAGE_SIZE}
          onChange={page => { setPage(page); scrollIntoView() }}
        />
      </Box>
    </Box>
  );
}
