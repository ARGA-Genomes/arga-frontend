"use client";

import { MAX_WIDTH } from "@/app/constants";
import DataTypeHeader from "@/components/data-type-header";
import { LoadOverlay } from "@/components/load-overlay";
import { usePreviousPage } from "@/components/navigation-history";
import { Taxa, Taxon } from "@/generated/types";
import { gql, useQuery } from "@apollo/client";
import { Box, Button, Center, Container, Drawer, Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

const GET_SPECIES = gql`
  query TaxaSpecies($page: Int, $perPage: Int, $filters: [FilterItem]) {
    taxa(filters: $filters) {
      species(page: $page, perPage: $perPage) {
        total
        records {
          taxonomy {
            canonicalName
          }
          photo {
            url
            publisher
            license
            rightsHolder
          }
          dataSummary {
            genomes
            loci
            specimens
            other
          }
        }
      }
      filterOptions {
        ecology
        ibra
        imcra
        state
        drainageBasin
      }
    }
  }
`;

function Species() {
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);

  // const [filters, setFilters] = useState<Filters>({}); // filters implementation

  const { loading, error, data, previousData } = useQuery<{ taxa: Taxa }>(GET_SPECIES, {
    variables: {
      page,
      perPage: PAGE_SIZE,
      filters: [], // Filters implementation
    },
  });

  // const records = data?.taxa.species.records || previousData?.taxa.species.records;
  const records: Taxon[] = []; // taxa.species no longer exists in the GraphQL schema

  return (
    <Stack>
      <Drawer opened={opened} onClose={close} withCloseButton={false} position="right" size="xl">
        <Box pt={200}>{/* filters implementation */}</Box>
      </Drawer>

      <LoadOverlay visible={loading} />
      {error && <Text>{error.message}</Text>}

      <Grid gutter={50} align="baseline">
        <Grid.Col span="content">
          <Title order={5}>Browse species</Title>
        </Grid.Col>

        <Grid.Col span="auto">
          <Group>
            <Text fz="sm" fw={300}>
              Filters
            </Text>
            {/* filters implementation */}
          </Group>
        </Grid.Col>

        <Grid.Col span="content">
          <Button leftSection={<IconFilter />} variant="subtle" onClick={open}>
            Filter
          </Button>
        </Grid.Col>
      </Grid>

      {records?.length === 0 && (
        <Center>
          <Text fz="xl">No data found</Text>
        </Center>
      )}

      {/* <SimpleGrid cols={5} pt={40}>
        {records?.map((record) => (
          <SpeciesCard key={record.taxonomy.canonicalName} species={record} />
        ))}
      </SimpleGrid>

      <PaginationBar total={data?.taxa.species.total} page={page} pageSize={PAGE_SIZE} onChange={setPage} /> */}
    </Stack>
  );
}

export default function LocusListPage() {
  const [_, setPreviousPage] = usePreviousPage();

  useEffect(() => {
    setPreviousPage({ name: `browsing single loci`, url: "/browse/loci" });
  }, [setPreviousPage]);

  return (
    <Stack mt={40}>
      <DataTypeHeader dataType="Single loci" />

      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Stack>
            <Paper p="xl" radius="lg" pos="relative" withBorder>
              <Species />
            </Paper>
          </Stack>
        </Container>
      </Paper>
    </Stack>
  );
}
