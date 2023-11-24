'use client';

import { SpeciesCard } from "@/components/species-card";
import { gql, useQuery } from "@apollo/client";
import { Paper, SimpleGrid, Text, Title, Group, Stack, Container } from "@mantine/core";
import { useEffect, useState } from "react";
import { PaginationBar } from "@/components/pagination";
import { MAX_WIDTH } from "@/app/constants";
import { LoadOverlay } from "@/components/load-overlay";
import { usePreviousPage } from "@/components/navigation-history";


const PAGE_SIZE = 10;

const GET_DETAILS = gql`
query SourceDetails($name: String) {
  source(by: { name: $name }) {
    license
    accessRights
    rightsHolder
    author
    name

    datasets {
      name
      globalId
    }
  }
}`;

type Dataset = {
  name: string,
  globalId: string,
}

type Source = {
  license: string,
  accessRights: string,
  rightsHolder: string,
  author: string,
  name: string,

  datasets: Dataset[],
};

type DetailsQueryResults = {
  source: Source,
};


const GET_SPECIES = gql`
query SourceSpecies($name: String, $page: Int, $pageSize: Int) {
  source(by: { name: $name }) {
    species(page: $page, pageSize: $pageSize) {
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
}`;

type Photo = {
  url: string,
}

type DataSummary = {
  genomes: number,
  loci: number,
  specimens: number,
  other: number,
}

type Record = {
  taxonomy: { canonicalName: string },
  photo: Photo,
  dataSummary: DataSummary,
}

type SpeciesQueryResults = {
  source: {
    species: {
      records: Record[],
      total: number,
    }
  },
};


function Species({ source }: { source: string }) {
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery<SpeciesQueryResults>(GET_SPECIES, {
    variables: { name: source, page, pageSize: PAGE_SIZE },
  });

  const records = Array.from(data?.source.species.records || []);

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
        total={data?.source.species.total}
        page={page}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </>
  );
}


function SourceDetails({ source }: { source: string }) {
  const { loading, error, data } = useQuery<DetailsQueryResults>(GET_DETAILS, {
    variables: { name: source }
  });

  return (
    <Stack gap={0}>
      <LoadOverlay visible={loading} />

      { error ? <Text>{error.message}</Text> : null }

      <Text c="dimmed" size="xs">{data?.source.author}</Text>
      <Text c="dimmed" size="xs">&copy; {data?.source.rightsHolder}</Text>
    </Stack>
  )
}


export default function BrowseSource({ params }: { params: { name: string } }) {
  const source = decodeURIComponent(params.name).replaceAll("_", " ");
  const [_, setPreviousPage] = usePreviousPage();

  useEffect(() => {
    setPreviousPage({ name: `browsing ${source}`, url: '/browse/sources/${params.name}' })
  }, [setPreviousPage])

  return (
    <Stack mt="xl">
      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Group gap={40}>
            <Text c="dimmed" fw={400}>SOURCE</Text>
            <Stack gap={0}>
              <Text fz={38} fw={700}>{source}</Text>
              <SourceDetails source={source} />
            </Stack>
          </Group>
        </Container>
      </Paper>

      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Stack>
            <Paper p="xl" radius="lg" withBorder>
              <Title order={5}>Browse species</Title>
              <Species source={source} />
            </Paper>
          </Stack>
        </Container>
      </Paper>
    </Stack>
  );
}
