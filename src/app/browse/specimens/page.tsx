"use client";

import { MAX_WIDTH } from "@/app/constants";
import { Photo } from "@/app/type";
import DataTypeHeader from "@/components/data-type-header";
import { Filter, FilterKind, intoFilterItem } from "@/components/filtering/common";
import { HasDataFilters } from "@/components/filtering/has-data";
import { HigherClassificationFilters } from "@/components/filtering/higher-classification";
import { LoadOverlay } from "@/components/load-overlay";
import { usePreviousPage } from "@/components/navigation-history";
import { PaginationBar } from "@/components/pagination";
import { SpeciesCard } from "@/components/species-card";
import { gql, useQuery } from "@apollo/client";
import {
  Accordion,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Drawer,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { IconFilter } from "@tabler/icons-react";

const PAGE_SIZE = 10;

interface Filters {
  classifications: Filter[];
  dataTypes: Filter[];
}

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

interface DataSummary {
  genomes: number;
  loci: number;
  specimens: number;
  other: number;
}

interface Species {
  taxonomy: {
    canonicalName: string;
  };
  photo: Photo;
  dataSummary: DataSummary;
}

interface FilterOptions {
  ecology: string[];
  ibra: string[];
  imcra: string[];
  state: string[];
  drainageBasin: string[];
}

interface Taxa {
  species: {
    records: Species[];
    total: number;
  };
  filterOptions: FilterOptions;
}

interface QueryResults {
  taxa: Taxa;
}

interface FiltersProps {
  filters: Filters;
  options?: FilterOptions;
  onChange: (filters: Filters) => void;
}

function Filters({ filters, onChange }: FiltersProps) {
  const [classifications, setClassifications] = useState<Filter[]>(filters.classifications);
  const [dataTypes, setDataTypes] = useState<Filter[]>(filters.dataTypes);

  useEffect(() => {
    onChange({
      classifications,
      dataTypes,
    });
  }, [classifications, dataTypes, onChange]);

  return (
    <Accordion defaultValue="hasData" variant="separated">
      <Accordion.Item value="hasData">
        <Accordion.Control>
          <FilterGroup
            label="Data types"
            description="Only show species that have specific types of data"
            image="/icons/data-type/Data type_ Whole genome.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <HasDataFilters filters={dataTypes} onChange={setDataTypes} />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="classification">
        <Accordion.Control>
          <FilterGroup
            label="Higher classification filters"
            description="Limit data based on taxonomy"
            image="/icons/data-type/Data type_ Higher taxon report.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <HigherClassificationFilters filters={classifications} onChange={setClassifications} />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

interface FilterGroupProps {
  label: string;
  description: string;
  image: string;
}

function FilterGroup({ label, description, image }: FilterGroupProps) {
  return (
    <Group wrap="nowrap">
      <Avatar src={image} size="lg" />
      <div>
        <Text>{label}</Text>
        <Text size="sm" c="dimmed" fw={400} lineClamp={1}>
          {description}
        </Text>
      </div>
    </Group>
  );
}

function FilterBadge({ filter }: { filter: Filter }) {
  return (
    <Badge variant="outline">
      {filter.scientificName || filter.canonicalName || filter.vernacularGroup || filter.hasData}
    </Badge>
  );
}

function Species() {
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);

  const [filters, setFilters] = useState<Filters>({
    classifications: [],
    dataTypes: [
      {
        hasData: FilterKind.Specimens,
        editable: false,
      },
    ],
  });

  const flattenFilters = (filters: Filters) => {
    const items = [...filters.classifications, ...filters.dataTypes];

    return items.filter((item): item is Filter => !!item);
  };

  console.log(filters, flattenFilters(filters), flattenFilters(filters).map(intoFilterItem));

  const { loading, error, data, previousData } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
      page,
      perPage: PAGE_SIZE,
      filters: flattenFilters(filters)
        .map(intoFilterItem)
        .filter((item) => item),
    },
  });

  const records = data?.taxa.species.records || previousData?.taxa.species.records;

  return (
    <Stack>
      <Drawer opened={opened} onClose={close} withCloseButton={false} position="right" size="xl">
        <Box pt={200}>
          <Filters filters={filters} options={data?.taxa.filterOptions} onChange={setFilters} />
        </Box>
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
            {flattenFilters(filters).map((filter, idx) => (
              <FilterBadge key={idx} filter={filter} />
            ))}
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

      <SimpleGrid cols={5} pt={40}>
        {records?.map((record) => (
          <SpeciesCard key={record.taxonomy.canonicalName} species={record} />
        ))}
      </SimpleGrid>

      <PaginationBar total={data?.taxa.species.total} page={page} pageSize={PAGE_SIZE} onChange={setPage} />
    </Stack>
  );
}

export default function SpecimenListPage() {
  const [_, setPreviousPage] = usePreviousPage();

  useEffect(() => {
    setPreviousPage({ name: `browsing specimens`, url: "/browse/specimens" });
  }, [setPreviousPage]);

  return (
    <Stack mt={40}>
      <DataTypeHeader dataType="Specimens" />

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
